import { connectToDatabase } from "../../../util/mongodb";

export default async function handler(req, res) {
  
    const { db } = await connectToDatabase();
    
    if (req.method === "POST") {
    const gamesCollection = db.collection("games");
    const result = await gamesCollection.insertOne(req.body);
  }

  if (req.method === "PUT") {
    if (req.body.collection==="games"){
      const gamesCollection = db.collection("games")
      const findResult = await gamesCollection.find({}).sort({ $natural: -1 }).limit(5).toArray();
      return res.json(findResult);
    }else{
    const editionsCollection = db.collection("editions");
    const updateResult = await editionsCollection.updateOne({ teamId: req.body.teamId, edition:1}, {$set:{points: req.body.points,
    wins: req.body.wins,
    losses: req.body.losses}});
    }
  }

  if (req.method === "GET"){
    const editionsCollection = db.collection("editions")
    const findResult = await editionsCollection.find({"edition": 1}).sort({points: -1, losses: 1}).toArray();
    return res.json(findResult);
    
  }

}