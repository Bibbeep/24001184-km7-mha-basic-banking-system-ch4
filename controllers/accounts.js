const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createAccount = async (req, res) => {
    const {
        userId,
        bankName,
        bankAccountNumber,
        balance
    } = req.body;

    if (isNaN(parseInt(userId))) {
        return res.status(400).send({
            status: 'Error',
            message: 'User ID must be a valid number'
        });
    }

    if (isNaN(parseFloat(balance))) {
        return res.status(400).send({
            status: 'Error',
            message: 'Balance must be a number'
        });
    }

    let userData;
    try {
        userData = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        });

        if (!userData) {
            return res.status(404).send({
                status: 'Error',
                message: 'User ID does not exist'
            });
        }

        accountData = await prisma.bankAccount.findFirst({
            where: {
                bankAccountNumber: bankAccountNumber
            }
        });

        if (accountData) {
            return res.status(400).send({
                status: 'Error',
                message: 'Bank account already exist'
            });
        }

        await prisma.bankAccount.create({
            data: {
                userId: userId,
                bankName: bankName,
                bankAccountNumber: bankAccountNumber,
                balance: parseFloat(balance),
            }
        });

        res.status(201);
        return res.send({
            status: 'Success',
            message: `New bank account with account number ${bankAccountNumber} has successfully added to user with id ${userId}`
        });
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();

        res.status(500);
        return res.send({
            status: 'Error',
            message: 'Failed to create a new account'
        });
    } finally {
        await prisma.$disconnect();
    }
};

const getAccounts = async (req, res) => {
    let accounts = [];

    try {
        accounts = await prisma.bankAccount.findMany();
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();

        res.status(500);
        res.send({
            status: 'Error',
            message: 'Failed to get all account data'
        });
    } finally {
        await prisma.$disconnect();
    }

    if (!accounts) {
        res.status(200);
        return res.send({
            status: 'Success',
            message: 'Accounts is empty',
            data: accounts
        });
    }

    res.status(200);
    return res.send({
        status: 'Success',
        data: accounts
    });
};

const getAccountById = async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
        return res.status(400).send({
            status: 'Error',
            message: 'Account ID must be a valid number'
        });
    }

    let accountData;
    try {
        accountData = await prisma.bankAccount.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!accountData) {
            return res.status(404).send({
                status: 'Failed',
                message: 'Bank account does not exist'
            });
        }
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();

        res.status(500);
        res.send({
            status: 'Error',
            message: 'Failed to get account data'
        });
    } finally {
        await prisma.$disconnect();
    }

    res.status(200);
    return res.send({
        status: 'Success',
        data: accountData
    });
};

module.exports = {
    createAccount,
    getAccounts,
    getAccountById
};