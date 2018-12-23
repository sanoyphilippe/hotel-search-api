# hotel-search-api

Hotel search api sample implementation for https://gist.github.com/melvrickgoh/d7113d7c14ef3a41793082200f94475f

## Getting Started

Clone this repository on your local system
```
git clone https://github.com/sanoyphilippe/hotel-search-api.git
```

### Prerequisites

You must have npm and nodejs installed on your local system.
See https://nodejs.org for installation instructions

### Installing

A step by step series of examples that tell you how to get a development env running.

First we need to install the node_modules.
So change to the directory created in your system, after cloning this repository.

```
cd hotel-search-api
npm install
```
#### Config
Next we need to configure the config file.
The config file is `/config.json`
It contains the following default values.
```
{
    "SUPPLIER_RES": [
        "https://api.myjson.com/bins/2tlb8",
        "https://api.myjson.com/bins/42lok",
        "https://api.myjson.com/bins/15ktg"
    ],
    "PORT": 3000
}
```
`SUPPLIER_RES` defines the urls for our supplier data

`PORT` is simply the port in which the app will run on your system.

If you wish to add more suppliers simply add new url entries into the `SUPPLIER_RES`

#### Running the app

Now after doing all of the above, simply run the command
```
node index.js
```

If you're running the app on your local system and you just used the default values, open up your web browser and go to the following url `http://localhost:3000/hotels`
This will by default show you all the hotels with the lowest prices from all the suppliers

If you wish to search from specific suppliers only then you could try `http://localhost:3000/hotels?suppliers=supplier3,supplier2`
so this would give you results from suppliers 2 and 3 only (suppliers 2 and 3 come from the 2nd and 3rd url entries you've placed for `SUPPLIER_RES`)

## Authors

* **Philippe Oscar Sanoy** - *hoping to pass this task :D*

See also the list of [contributors](https://github.com/sanoyphilippe/hotel-search-api/graphs/contributors) who participated in this project.
