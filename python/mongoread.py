from pymongo import MongoClient

client = MongoClient()
db = client.pmtdb

pmts = db.pmts.find()
for document in pmts:
   print(document)

client.close()
