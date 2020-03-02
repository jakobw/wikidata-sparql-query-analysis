// evil hacky function to display plotly charts

$$.html(`<script>
requirejs.config({
    paths: {
        plotly: 'https://cdn.plot.ly/plotly-latest.min.js?noext',
    },
});
</script>`)

module.exports = function makePlot(data) {
    var randomId = Math.round(Math.random() * 10000)
    $$.html(`
        <div id="${randomId}"/>
        <script>
        requirejs( ['plotly'], function(plotly) {
            plotly.newPlot('${randomId}', ${JSON.stringify(data)})
        } )
        </script>
    `)
}
