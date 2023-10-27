import pymongo
from pymongo import MongoClient
import json
import matplotlib.pyplot as plt
import logging
client = MongoClient('mongodb://localhost:27017/')
db = client['empmern']
collection = db['employees']
print("Connected")

highest_hourly_rate_doc = collection.find_one(sort=[("Hourly Rate", pymongo.DESCENDING)])
smallest_hourly_Rate = collection.find_one({"Hourly Rate": {"$exists": True}},sort=[("Hourly Rate", pymongo.ASCENDING)])

hourlyrate=[{"highest":highest_hourly_rate_doc['Hourly Rate']},
            {"lowest":smallest_hourly_Rate['Hourly Rate']}]

try:
    with open('E:\\employeesys\\frontend\\public\\hourlyrate.json', 'w') as json_file:
        json.dump(hourlyrate, json_file)
except Exception as e:
    logging.error(f"Error writing to file: {e}")


part_time_count = collection.count_documents({"Full or Part-Time": "P"})
full_time_count = collection.count_documents({"Full or Part-Time": "F"})

# Plotting the bar chart
categories = ['Part-Time', 'Full-Time']
values = [part_time_count, full_time_count]

plt.bar(categories, values, color=['blue', 'green'])
plt.title('Number of Documents by Employment Type')
plt.xlabel('Employment Type')
plt.ylabel('Number of Documents')
plt.savefig('E:\\employeesys\\frontend\\public\\graph.png')
print("First graph made")
plt.close()


data = collection.find({"Hourly Rate": {"$exists": True},"Typical Hours": {"$exists": True}},{"Hourly Rate": 1, "Typical Hours": 1})

# Extract 'Hourly Rate' and 'Typical Hours' values
hourly_rates = []
typical_hours = []

for record in data:
    hourly_rates.append(record["Hourly Rate"])
    typical_hours.append(record["Typical Hours"])

# Plotting the scatter plot
plt.scatter(typical_hours, hourly_rates, color='r', alpha=0.5)
plt.title('Scatter Plot of Hourly Rate vs Typical Hours')
plt.xlabel('Typical Hours')
plt.ylabel('Hourly Rate')
plt.grid(True)
plt.savefig('E:\\employeesys\\frontend\\public\\graph2.png')
plt.close()

part_time_count = collection.count_documents({"Salary or Hourly": "Salary"})
full_time_count = collection.count_documents({"Salary or Hourly": "Hourly"})

# Plotting the bar chart
categories = ['Salary', 'Hourly']
values = [part_time_count, full_time_count]

plt.bar(categories, values, color=['blue', 'green'])
plt.title('Number of Documents by Employment Type')
plt.xlabel('Employment Type')
plt.ylabel('Number of Documents')
plt.savefig('E:\\employeesys\\frontend\\public\\graph3.png')
plt.close()

salaries = [doc["Annual Salary"] for doc in collection.find( {"Annual Salary":{"$exists":True}})]

# Plotting the histogram
plt.hist(salaries, bins=10, color='skyblue', edgecolor='black')
plt.title('Histogram of Salaries')
plt.xlabel('Salary Range')
plt.ylabel('Frequency')
plt.savefig('E:\\employeesys\\frontend\\public\\graph4.png')
plt.close()

pipeline = [
    {"$group": {"_id": "$Job Titles", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}},
    {"$limit":5}
]
jj = collection.aggregate(pipeline)
with open('E:\\employeesys\\frontend\\public\\jobtitle.json', 'w') as json_file:
    json.dump(list(jj), json_file)

pipeline = [
    {"$group": {"_id": "$Department", "count": {"$sum": 1}}},
    {"$sort": {"count": -1}},
    {"$limit":5}
]
jj = collection.aggregate(pipeline)
with open('E:\\employeesys\\frontend\\public\\department.json', 'w') as json_file:
    json.dump(list(jj), json_file)


salaries = [doc["Annual Salary"] for doc in collection.find( {"Annual Salary":{"$exists":True}})]

# Create a box plot
plt.boxplot(salaries)
plt.title('Box Plot of Salary Distribution')
plt.ylabel('Salary')
plt.savefig('E:\\employeesys\\frontend\\public\\graph5.png')
plt.close()



pipeline = [
    {
        "$group": {
            "_id": "$Department",
            "averageSalary": {"$avg": "$Annual Salary"}
        }
    }
]
results = list(collection.aggregate(pipeline))

# Extract departments and average salaries from the results
departments = [result['_id'] for result in results]
salaries = [result['averageSalary'] for result in results]

# Create a bar plot
plt.figure(figsize=(30, 10))
plt.bar(departments, salaries, color='skyblue')
plt.xlabel('Departments')
plt.ylabel('Average Salary')
plt.title('Average Salaries Across Different Departments')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('E:\\employeesys\\frontend\\public\\graph6.png')
plt.close()
