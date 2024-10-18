const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTransaction = async (req, res) => {
    const {
        sourceAccountId,
        destinationAccountId,
        amount
    } = req.body;

    if (isNaN(parseInt(sourceAccountId))) {
        return res.status(400).send({
            status: 'Error',
            message: 'Source account ID must be a valid ID'
        });
    }

    if (isNaN(parseInt(destinationAccountId))) {
        return res.status(400).send({
            status: 'Error',
            message: 'Destination account ID must be a valid ID'
        });
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).send({
            status: 'Error',
            message: 'Transaction amount must be a valid number'
        });
    }

    try {
        const sourceAccData = await prisma.bankAccount.findUnique({
            where: {
                id: parseInt(sourceAccountId)
            }
        });

        if (!sourceAccData) {
            return res.status(404).send({
                status: 'Failed',
                message: 'Source bank account does not exist'
            });
        }
        
        const destAccData = await prisma.bankAccount.findUnique({
            where: {
                id: parseInt(destinationAccountId)
            }
        });

        if (!destAccData) {
            return res.status(404).send({
                status: 'Failed',
                message: 'Source bank account does not exist'
            });
        }

        if (sourceAccData.balance < parseFloat(amount)) {
            return res.status(400).send({
                status: 'Error',
                message: 'Source bank account does not have sufficient balance'
            });
        }

        await prisma.bankAccount.update({
            where: { id: sourceAccountId },
            data: { balance: sourceAccData.balance - parseFloat(amount)}
        });

        await prisma.bankAccount.update({
            where: { id: destinationAccountId },
            data: { balance: destAccData.balance - parseFloat(amount)}
        });

        await prisma.transaction.create({
            data: {
                sourceAccountId: sourceAccountId,
                destinationAccountId: destinationAccountId,
                amount: parseFloat(amount)
            }
        });

        res.status(201);
        return res.send({
            status: 'Success',
            message: `Successfully transferred ${amount} from bank account with id ${sourceAccountId} to bank account with id ${destinationAccountId}`
        });
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();

        res.status(500);
        res.send({
            status: 'Error',
            message: 'Failed to create transaction'
        });
    } finally {
        await prisma.$disconnect();
    }
};

const getTransactions = async (req, res) => {
    let transactions = [];

    try {
        transactions = await prisma.transaction.findMany();
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();

        res.status(500);
        res.send({
            status: 'Error',
            message: 'Failed to get all transaction data'
        });
    } finally {
        await prisma.$disconnect();
    }

    if (!transactions) {
        res.status(200);
        return res.send({
            status: 'Success',
            message: 'Transactions is empty',
            data: transactions
        });
    }

    res.status(200);
    return res.send({
        status: 'Success',
        data: transactions
    });
};

const getTransactionById = async (req, res) => {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
        return res.status(400).send({
            status: 'Error',
            message: 'Transaction ID must be a valid ID'
        });
    }

    try {
        const transactionData = await prisma.transaction.findUnique({
            where: { id: parseInt(id) },
            include: {
                sourceAccount: true,
                destinationAccount: true
            }
        });

        if (!transactionData) {
            return res.status(404).send({
                status: 'Failed',
                message: 'Transaction does not exist'
            });
        }

        res.status(200);
        return res.send({
            status: 'Success',
            data: transactionData
        });
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();

        res.status(500);
        res.send({
            status: 'Error',
            message: 'Failed to get transaction data'
        });
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById
};