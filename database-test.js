const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

async function openDb() {
  return sqlite.open({
    filename: "/tmp/mydb.sqlite",
    driver: sqlite3.Database,
  });
}

async function setup() {
  const db = await openDb();
  await db.migrate({ migrationsPath: "./migrations", force: "last" });

  const faq = await db.all("SELECT * FROM FAQ ORDER BY createDate DESC");
  console.log("All Faq", JSON.stringify(faq, null, 2));

  const cars = await db.all("SELECT * FROM Car");
  console.log("All Cars", JSON.stringify(cars, null, 2));
}

setup();
