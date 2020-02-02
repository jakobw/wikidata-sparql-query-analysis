DIR = 'wikidatawiki'

Dir.foreach("./#{DIR}") do |filename|
    next if filename == '.' or filename == '..'

    file_path = "./#{DIR}/#{filename}"
    matches = open(file_path).read.match(/wikidata list.*\|sparql=(.*?)(\n?\s*\|\w+)/mi)

    next unless matches

    query = matches.captures.first
    File.write(file_path, query)
end
