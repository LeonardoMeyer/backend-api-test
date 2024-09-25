const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    const { titular, saldo } = req.body;
    try {
      const novaConta = await prisma.conta.create({
        data: {
          titular,
          saldo,
        },
      });
      res.status(201).json(novaConta);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar conta' });
    }
});


router.get('/', async (req, res) => {
    try {
      const contas = await prisma.conta.findMany({
        where: {
          excluida: false,
        },
      });
      res.json(contas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar contas' });
    }
});
  

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const conta = await prisma.conta.findUnique({
        where: { id: parseInt(id) },
      });
      if (!conta || conta.excluida) {
        return res.status(404).json({ error: 'Conta não encontrada' });
      }
      res.json(conta);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar conta' });
    }
  });
  

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titular, saldo } = req.body;
    try {
      const contaAtualizada = await prisma.conta.update({
        where: { id: parseInt(id) },
        data: {
          titular,
          saldo,
        },
      });
      res.json(contaAtualizada);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar conta' });
    }
});
  

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const contaExcluida = await prisma.conta.update({
        where: { id: parseInt(id) },
        data: {
          excluida: true,
        },
      });
      res.json({ message: 'Conta desativar', conta: contaExcluida });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao desativar a conta' });
    }
});
  
module.exports = router;