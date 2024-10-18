const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async (req, res) => {
    const {
        name,
        email,
        password,
        identityType,
        identityNumber,
        address
    } = req.body;

    try {
        await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: password,
                profile: {
                    create: {
                        identityType: identityType,
                        identityNumber: identityNumber,
                        address: address
                    }
                }
            }
        });
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        
        res.status(500);
        return res.send({
            status: 'Error',
            message: 'Failed to create user'
        });
    } finally {
        await prisma.$disconnect();
    }

    res.status(201);
    return res.send({
        status: 'Success',
        message: `User ${name} is successfully created!`
    });
};

const getUsers = async (req, res) => {
    let users = [];

    try {
        users = await prisma.user.findMany();
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();

        res.status(500);
        res.send({
            status: 'Error',
            message: 'Failed to get all user data'
        });
    } finally {
        await prisma.$disconnect();
    }

    if (!users) {
        res.status(200);
        return res.send({
            status: 'Success',
            message: 'Users is empty',
            data: users
        });
    }

    res.status(200);
    return res.send({
        status: 'Success',
        data: users
    });
};

const getUserById = async (req, res) => {
    // Apakah password user direturn melalui response atau tidak
    // secara eksplisit tidak dideskripsikan pada soal challenge 
    // ¯\_(ツ)_/¯
    const { id } = req.params;

    // Assuming id is an auto-increment integer, not a uuid string
    if (isNaN(parseInt(id))) {
        return res.status(400).send({
            status: 'Error',
            message: 'User ID must be a valid number'
        });
    }

    let userData, profileData;

    try {
        userData = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        profileData = await prisma.profile.findUnique({
            where: {
                userId: parseInt(id)
            }
        });
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        res.status(500);
        return res.send({
            status: 'Error',
            message: 'Failed to get user data'
        });
    } finally {
        await prisma.$disconnect();
    }

    if (!userData) {
        res.status(404);
        return res.send({
            status: 'Failed',
            message: 'User not found!'
        });
    }

    res.status(200);
    return res.send({
        status: 'Success',
        data: { ...userData, ...profileData }
    });
};

module.exports = {
    createUser,
    getUsers,
    getUserById
};