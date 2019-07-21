const keys = require("./keys");
const port = process.env.PORT || 5000;
// Express Set up
const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

// PostGre
const { Pool } = require("pg");
const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	port: keys.pgPort,
	database: keys.pgDatabase,
	password: keys.pgPassword,
});
pgClient.on("error", () => console.log("Pg Connection lost!"));

pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT)").catch(err => console.log(err));

// Redis CLient
const redis = require("redis");
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 5000,
});
const redisPublisher = redisClient.duplicate();

// Express Routes

app.get("/", (req, res) => {
	res.json({ hi: "HI" });
});

app.get("/values/all", async (req, res) => {
	const values = await pgClient.query("SELECT * FROM values");
	res.json({ rows: values.rows, ...values });
});
app.get("/values/current", async (req, res) => {
	redisClient.hgetall("values", (err, values) => {
		res.send(values);
	});
});

app.post("/values", async (req, res) => {
	const index = req.body.index ? parseInt(req.body.index) : null;
	if (!index) return res.status(422).json({ error: true, message: "Please send an index!" });
	if (index && index > 40) return res.status(422).json({ error: true, message: "Index too high!" });

	redisClient.hset("values", index, "Nothing yet!");
	redisPublisher.publish("insert", index);
	pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

	res.send({ success: true });
});

app.listen(port, () => console.info("Server running on port " + port));
