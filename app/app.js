'use strict';

const Analyser = require('./analyser.js');
const express = require('express');
const PhantomPool = require('phantom-pool').default;

const app = express();
const analyser = new Analyser();

const pool = new PhantomPool({
    maxUses: 10,
    phantomArgs: [['--ignore-ssl-errors=true', '--disk-cache=true', '--load-images=no']]
});

app.get('/analysis', function (req, res) {
    const target = req.query.url;
    pool.use(async (instance) => {
        console.log('analysing: ', target);
        const page = await instance.createPage();
        const status = await page.open(target, {operation: 'GET'});
        if (status === 'success') {
            const analyses = analyser.analyses.map((analysis) => {
                return analysis.run(page)
                    .catch((err) => {
                        console.log('metric [' + analysis.name + '] did not return a valid report, sending score 0', err);
                        return {name: analysis.name, result: {score: 0}}
                    }).then((result) => {
                        return {name: analysis.name, result: result};
                    });
            });
            const multiAnalyses = analyser.multiAnalyses.map(multiAnalysis => {
                return multiAnalysis.run(page)
                    .catch((err) => {
                        console.log('metric a11y did not return a valid report, sending score 0', err);
                        return multiAnalysis.names.map((it) => {
                            return {name: it, score: 0}
                        });
                    }).then((result) => {
                        return result.map(singleResult => {
                            return {name: singleResult.originalName, result: {score: singleResult.score}}
                        });
                    });
            });
            Promise.all(analyses.concat(multiAnalyses))
                .then((results) => {
                    return results.reduce((a, b) => {
                        if (Array.isArray(b)) return a.concat(b);
                        else a.push(b);
                        return a;
                    }, []);
                })
                .then((it) => {
                    let out = {};
                    it.forEach((analysis) => out[analysis.name] = analysis.result);
                    res.json({analysis: out, status: {responseCode: 200}})
                });
        } else {
            let results = {};
            analyser.analyses.forEach((analysis) => results[analysis.name] = {score: 0});
            res.json({analysis: results, status: {responseCode: 408}});
        }
    });
});

app.listen(process.env.PORT || 5000);
console.log('started on port:' + process.env.PORT);