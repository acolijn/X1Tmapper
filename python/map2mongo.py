#-------------------------------------------------------------------------------------------
#
# map2mongo.py: convert XENON1T mappings into MongoDB
#
#-------------------------------------------------------------------------------------------
from pymongo import MongoClient
import csv
#-------------------------------------------------------------------------------------------
locations = []
number_of_header_mapping   = 3
number_of_header_locations = 20
#-------------------------------------------------------------------------------------------
def read_pmt_locations():
  # header lines first
  for _ in range(number_of_header_locations):
    header_line = next(pmt_location_file)
    print(header_line)

  npmt = 0
  x   = [999,999]
  tag = ['x','y']

  for line in pmt_location_file:
     location = {}
     words = line.split(',')
     for i in range(2):
       x[i] = words[i].split(' ')[2]
       location[tag[i]]  = x[i]

     locations.append(location)
     print(npmt,' position = ',locations[npmt]['x'],' ',locations[npmt]['y'])
     npmt = npmt + 1


#-------------------------------------------------------------------------------------------

#
# start the Mongo client
#
#
client = MongoClient()
db = client.pmtdb
#client = MongoClient("mongodb://client-4dfa8b8a:8170bba0-ec5d-c2e0-66f1-d4d69780f068@production-db-a3.meteor.io:27017/x1tmapper_meteor_com")
#db = client.x1tmapper_meteor_com
#
# cable mapping file
#
mapping_file = open('XENON1T Cabling Map  - Map.csv', 'r')
#
# PMT coordinates
#
pmt_location_file = open('XENON1T.ini', 'r')

#
# read the PMT locations
#
read_pmt_locations()

# find the first line of the csv file
mapping_file.seek(0)
# skip the header
for _ in range(number_of_header_mapping):
  header_line = next(mapping_file)
##  print(header_line)

#
# generate the MongoDB dictionary
#

#mapping_reader = csv.DictReader( mapping_file )

mapping_reader = csv.DictReader( mapping_file )
i=0
for key in mapping_reader.fieldnames:
   key = key.replace(' ','_')
   key = key.replace('/','_')

   mapping_reader.fieldnames[i] = key
   i=i+1

#
# read the excel spreadsheet into JSON format
#
db.pmts.remove()
n=0
for row in mapping_reader:
    for key in mapping_reader.fieldnames:
        row[key] = row[key].replace('?','')
        row[key] = row[key].replace(' ','')

    # reformat some of the IDs
    row['ADC'] = "{:.1f}".format(float(row['ADC']))
    row['ADC_module'] = int(row['ADC'].split('.')[0])
    row['ADC_channel'] = int(row['ADC'].split('.')[1])

    row['Signal_Connector'] = "{:5.2f}".format(float(row['Signal_Connector']))
    row['Amp'] ="{:.2f}".format(float(row['Amp']))
    row['Amp_module'] = int(row['Amp'].split('.')[0])
    row['Amp_channel'] = int(row['Amp'].split('.')[1])
    row['HV'] ="{:.2f}".format(float(row['HV']))
    row['HV_module'] = int(row['HV'].split('.')[0])
    row['HV_channel'] = int(row['HV'].split('.')[1])

    row['HV_Connector'] = "{:5.2f}".format(float(row['HV_Connector']))


    if ( row['Top_Bottom'] != "veto"):
      pmt_id   = int(row['PMT_Location'])
      location = locations[pmt_id]
      row['x'] = "{:5.2f}".format(float(location['x']))
      row['y'] = "{:5.2f}".format(float(location['y']))

    else:
      row['x'] = 999;
      row['y'] = 999;

    row['PMT_Location'] = n
    n=n+1
    print(row)
    db.pmts.insert_one(row)


print('Number of entries in the PMT table: ',db.pmts.count())

client.close()
#-------------------------------------------------------------------------------------------
