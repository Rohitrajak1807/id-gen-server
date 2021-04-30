import express from 'express'
import mariadb from 'mariadb'
import bodyParser from 'body-parser'
import cors from 'cors'

const PORT = 3000

const app = express()
app.use(bodyParser.json())
app.use(cors())

const db = await mariadb.createConnection({
    host: 'localhost',
    user: 'rohit',
    password: 'carryona7x'
})

app.get('/students', async (request, response) => {
    const res = await db.query({
        sql: 'SELECT * FROM id_cards.issued_id_cards'
    })
    response.json(res)
})

app.post('/students', async (request, response) => {
    let studentData = request.body
    console.log(request.body)
    const res = await db.query({
        sql: `INSERT INTO id_cards.issued_id_cards VALUES ('${studentData.rollNumber}', '${studentData.course}', '${studentData.department}', '${studentData.instituteEmail}', '${studentData.fullName}', '${studentData.dateOfBirth}', '${studentData.phone}', '${studentData.permanentAddress}')`
    })
    response.json(res)
})

app.get('/search', async (request, response) => {
    const res = await db.query({
        sql: `SELECT name, roll_no, department FROM id_cards.issued_id_cards where roll_no='${request.query.rollNumber}'`
    })
    response.send(res)
})

app.get('/students/:rollNumber', async (request, response) => {
    const res = await db.query({
        sql: `SELECT * FROM id_cards.issued_id_cards where roll_no='${request.params.rollNumber}'`
    })
    response.send(res)
})

app.put('/students/:rollNumber', async (request, response) => {
    let newData = request.body
    let student = {
        course: '',
        department: '',
        ins_email: '',
        name: '',
        date_of_birth: null,
        phone: '',
        perma_address: ''
    }
    student.course = newData.course
    student.department = newData.department
    student.ins_email = newData.instituteEmail
    student.name = newData.fullName
    student.date_of_birth = newData.dateOfBirth
    student.phone = newData.phone
    student.perma_address = newData.permanentAddress
    let updateFields = ''
    Object.entries(student).forEach(field => {
            updateFields += `${field[0]}='${field[1]}',`
        })
    updateFields = updateFields.slice(0, updateFields.length - 1)
    console.log(updateFields)
    const res = await db.query({
        sql: `UPDATE id_cards.issued_id_cards SET ${updateFields} where roll_no='${request.params.rollNumber}'`
    })
    response.json(res)
})

app.delete('/students/:rollNumber', async (request, response) => {
    const res = await db.query({
        sql: `DELETE FROM id_cards.issued_id_cards WHERE roll_no='${request.params.rollNumber}'`
    })
    response.json(res)
})

app.listen(PORT)
