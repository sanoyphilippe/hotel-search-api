const https = require("https");
const express = require("express");
const cache = require("memory-cache");

const config = require("./config.json");

const PORT = process.env.PORT || config["PORT"] || 3000;
const app = express();
const supplier_res = config['SUPPLIER_RES'];
let memCache = new cache.Cache();

let cacheMiddleware = (duration) => {
    return (req, res, next) => {
        let key = "__nodejs__" + req.originalUrl || req.url;
        let cacheContent = memCache.get(key);
        if (cacheContent) {
            res.send(cacheContent);
            return;
        } else {
            res.sendResponse = res.send;
            res.send = body => {
                memCache.put(key, body, duration * 10000);
                res.sendResponse(body);
            };
            next();
        }
    };
};

function getHotelsFromSuppliers(suppliers, callback) {
    let matching_hotels = {}
    let included_suppliers = []
    if (suppliers) {
        // get from specified suppliers
        let query_supplier_res = []
        for (let i = 0; i < suppliers.length; i++) {
            // get supplier number
            included_suppliers.push(parseInt(suppliers[i].toLowerCase().replace("supplier", "")) - 1)
        }
    } else {
        // get from all suppliers, as long as there are suppliers
        if (supplier_res.length)
            included_suppliers = [...Array(supplier_res.length).keys()]
    }
    let done_api_call_count = 0;
    // query all included suppliers
    for (let i = 0; i < included_suppliers.length; i++) {
        if (!supplier_res[included_suppliers[i]]) {
            done_api_call_count++;
            continue;
        }

        https.get(supplier_res[included_suppliers[i]], function (supp_res) {
            let body = '';
            supp_res.on('data', (d) => {
                body += d
            });

            supp_res.on('end', () => {
                const supp_data = JSON.parse(body)
                for (const key in supp_data) {
                    if (supp_data.hasOwnProperty(key)) {
                        const curr_price = supp_data[key];
                        // add hotel to the map if it is a new or if it has a lower price than the currently recorded hotel for another supplier
                        if (!matching_hotels[key] || (matching_hotels[key] && matching_hotels[key].price > curr_price)) {
                            matching_hotels[key] = { price: curr_price, supplier: "supplier" + (included_suppliers[i] + 1) };
                        }
                    }
                }
                // last api call done, return matching hotel data
                if (++done_api_call_count === included_suppliers.length) {
                    let hotel_list = []
                    // convert to a list/array
                    for (const key in matching_hotels) {
                        if (matching_hotels.hasOwnProperty(key)) {
                            const hotel = matching_hotels[key];
                            hotel_list.push({ id: key, price: hotel.price, supplier: hotel.supplier })
                        }
                    }
                    callback(hotel_list);
                }
            });
        }).on('error', (e) => {
            console.error(e);
        });
    }
    // if specified suppliers do not exist, return empty list
    if (done_api_call_count === included_suppliers.length) {
        callback([])
    }
}

app.get("/hotels", cacheMiddleware(30), function (req, res) {
    getHotelsFromSuppliers(req.query.suppliers ? req.query.suppliers.split(",") : null, (result) => {
        res.send(result);
    });
});

app.listen(PORT, function () {
    console.log(`App running on port ${PORT}`);
});
