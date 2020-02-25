# Script that finds pages using the Wikidata list template and writes them to a CSV file.
# Note that this also adds pages that transclude another page containing the Wikidata list tepmlate.

require 'open-uri'
require 'uri'
require 'json'
require 'csv'

SITE_URL = 'https://eu.wikipedia.org'
WIKI_NAME = 'euwiki'
API_URL = "#{SITE_URL}/w/api.php"
WIKI_URL = "#{SITE_URL}/wiki/"

search_query = {
    action: 'query',
    format: 'json',
    list: 'embeddedin',
    eititle: 'Template: Wikidata list',
    eilimit: 'max'
}

articles = []

loop do
    puts "#{API_URL}?#{URI.encode_www_form(search_query)}"
    result = JSON.parse(open("#{API_URL}?#{URI.encode_www_form(search_query)}").read)

    result['query']['embeddedin'].each do |page|
        articles << page['title']
        sleep 0.1
    end

    break unless result['continue']
    search_query[:eicontinue] = result['continue']['eicontinue']

    sleep 1
end

CSV.open("#{WIKI_NAME}.csv", "w") do |csv|
    articles.each do |a|
        csv << [a, "#{WIKI_URL}#{a}"]
    end
  end
