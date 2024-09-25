const request = require('supertest');
const express = require('express');
const contaRoutes = require('../routes/contaRoutes.js')
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ errorFormat: "minimal" });

const app = express();
app.use(express.json());

app.use('/contas', contaRoutes);

describe('Testa todos os endpoints de /contas', () => {

    beforeAll(async () => {
        await prisma.conta.deleteMany({})
    })

    afterAll(async () => {
        await prisma.conta.deleteMany({})
    })

    it('Deve criar uma conta: ', async () => {
        let conta = {
            "titular": "fulaninho lindo",
            "saldo": 2.5
        };
    
        const response = await request(app).post('/contas').send(conta);
             
        console.log(response.body);
        expect(response.statusCode).toBe(201);
        expect(response.body.titular).toBe("fulaninho lindo");

    })

    it('Deve listar todas as contas: ', async () => {
        const response = await request(app).get('/contas');
        expect(response.statusCode).toBe(200);

        let contaId = response.body[0].id;

        const response2 = await request(app).get(`/contas/${contaId}`);
        expect(response2.statusCode).toBe(200);
        expect(response2.body.id).toBe(contaId);

        let contaId2 = contaId + 1;
        const response3 = await request(app).get(`/contas/${contaId2}`);
        expect(response3.statusCode).toBe(404);
    })

    it('Deve atualizar uma conta: ', async () => {
        const response = await request(app).get('/contas');
        expect(response.statusCode).toBe(200);

        let conta = response.body[0];
        let contaId = conta.id;
        let titular = conta.titular;
        let saldo = conta.saldo;

        delete conta.id;
        conta.titular = "fulaninho lindo 2.0";
        conta.saldo = 3.0;

        const response2 = await request(app).put(`/contas/${contaId}`).send(conta);
        expect(response2.statusCode).toBe(200);
        expect(response2.body.titular).toBe("fulaninho lindo 2.0");
        expect(response2.body.saldo).toBe(3.0);
        expect(response2.body.saldo).not.toBe(saldo);
    })

    it('Deve excluir (desativar) uma conta: ', async () => {
        const response = await request(app).get('/contas');
        expect(response.statusCode).toBe(200);
    
        let contaId = response.body[0].id;
    
        const response2 = await request(app).delete(`/contas/${contaId}`);
        expect(response2.statusCode).toBe(200);  

        expect(response2.body.message).toBe('Conta desativar'); 

        const response3 = await request(app).get(`/contas/${contaId}`);
        expect(response3.statusCode).toBe(404);
    });
    
    
})
