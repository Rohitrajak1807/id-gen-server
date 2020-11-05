import express from 'express'
import mariadb from  'mariadb'
import bodyParser from 'body-parser'
const PORT = 3000

const app = express()
app.use(bodyParser.json())

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
    const res = await db.query({
        sql: `INSERT INTO id_cards.issued_id_cards VALUES ('${studentData.roll_no}', '${studentData.course}', '${studentData.department}', '${studentData.ins_email}', '${studentData.name}', '${studentData.date_of_birth}', '${studentData.phone}', '${studentData.perma_address}')`
    })
    response.json(res)
})

app.get('/students/:rollNumber', async (request, response) => {
    if(request.body.roll_no !== request.params.rollNumber) {
        response.json({error: `INVALID REQUEST`})
        return
    }
    const res = await db.query({
        sql: `SELECT * FROM id_cards.issued_id_cards where roll_no='${request.body.roll_no}'`
    })
    response.send(res)
})

app.put('/students/:rollNumber', async (request, response) => {
    if(request.params.rollNumber !== body.roll_no) {
        response.json({error: `INVALID REQUEST`})
        return
    }
    let updateFields = ''
    Object.entries(request.body).forEach(field => {
            updateFields += `${field[0]}='${field[1]}',`
        })
    updateFields = updateFields.slice(0, updateFields.length - 1)
    const res = await db.query({
        sql: `UPDATE id_cards.issued_id_cards SET ${updateFields} where roll_no='${request.params.rollNumber}'`
    })
    response.json(res)
})

app.delete('/students/:rollNumber', async (request, response) => {
    if(request.body.roll_no !== request.params.rollNumber) {
        response.json({error: `INVALID REQUEST`})
        return
    }
    const res = await db.query({
        sql: `DELETE FROM id_cards.issued_id_cards WHERE roll_no='${request.body.roll_no}'`
    })
    response.json(res)
})

app.listen(PORT)
