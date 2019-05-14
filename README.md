# MOBA_Shop

Final project for 19Spring CS-546 of Stevens Institute of Technology

## Instruction

We have all of the images the database needed store in [seed/](seed/) directory. The seeding script is in the same directory. Below is the steps to run the server of the website.

1. Fire up the MongoDB database

Make sure you have [installed the MongoDB database solution](https://docs.mongodb.com/manual/administration/install-community/) on your machine. The MongoDB use a directory `data/db/` under the root(`/`) to store related data files.

```shell
sudo mkdir /data/db
```
Use `sudo` command in case of permission denied, then try to run the MongoDB deamon, as the MongoDB is trying to write into the root directory, you may want to use `sudo` to force the command executed.

```shell
sudo mongod
```

2. Dump the data into the database

Our seeding script `seed.js` is put under the directory `seed/`. We are assuming that the person reading this instruction has Node.js and npm already installed. Under the repository, execute the following command to run the seeding script. 

```shell
node seed/seed.js
```

3. Run the server up!

In [`package.json`](package.json) we have configured the npm command to fire up the server. Execute the following command.

```shell
npm start
```

And now the website can be accessed locally through the [http://localhost:3000/](http://localhost:3000/)

## Group Member and task

> **NOTE**: The content below is a summary based on git log history. To reconcil, run `git log --author="$username"`.

### Siyuan He

1. Item route api and corresponding database operation
2. User route api and corresponding database operation
3. Search route api and corresponding database operation
4. Converasation route api and corresponding database operation
5. Part of seeding script
6. Fulfill security requirement

### Jake Lovrin

1. User authentication: log in & sign up

### Liu Yang

1. Cart and purchase route api and corresponding database operation

### Yinghui Cai

1. All front end javascript and css and handlebars template
2. Weilding the front end and route along with occationally database malfunction
3. Part of seeding script
4. Fulfill accessibility requirement

