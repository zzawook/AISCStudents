import hashlib
import mysql.connector

studentsData=open('2019-2020 student list.txt', 'r')
newData=[]
for studentData in studentsData:
	thisstudent=studentData.split("\t")
	newEmail=thisstudent[5].replace("\n","")
	thisstudent[5]=newEmail
	newData.append(thisstudent)

for studentData in newData:
	tempId=studentData[0]
	hashId=hashlib.sha256(tempId.encode())
	hexId=hashId.hexdigest()
	studentData.append(hexId)

mydb=mysql.connector.connect(
    host='68.183.93.197',
    user='aiscstudentsClient',
    password='airbusa3501000',
    database="aiscstudents"
)
cursor=mydb.cursor()
sql='insert into userDB(id, hashId, name) values(%s, %s, %s)'
for user in newData:
    val=(str(user[0]), str(user[6]), str(user[1]))
    cursor.execute(sql, val)
    mydb.commit()
    print(cursor.lastrowid)




