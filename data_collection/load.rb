require 'open-uri'
require 'uri'
require 'json'

SITE_URL = 'https://www.wikidata.org'
API_URL = "#{SITE_URL}/w/api.php"
WIKI_URL = "#{SITE_URL}/wiki/"

search_query = {
    action: 'query',
    format: 'json',
    list: 'embeddedin',
    eititle: 'Template: Wikidata list',
    eilimit: 'max'

}

loop do
    puts "#{API_URL}?#{URI.encode_www_form(search_query)}"
    result = JSON.parse(open("#{API_URL}?#{URI.encode_www_form(search_query)}").read)

    result['query']['embeddedin'].each do |page|
        puts page['title']
        # `wget "#{WIKI_URL}#{page['title']}?action=raw"`
        # sleep 0.1
    end

    break unless result['continue']
    search_query[:eicontinue] = result['continue']['eicontinue']

    sleep 1
end
