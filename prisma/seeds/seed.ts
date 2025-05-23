//import { PrismaClient } from "@prisma/client";
const { PrismaClient } = require("@prisma/client");
/*
Seed data is used to populate the database with initial data.
*/
//Menu Items
const moduleData = require("../initial-data/system_Modules_Enabled.json");
//GPT Models
const gptModelsData = require("../initial-data/gpt_Models.json");
//CRM
const crmOpportunityTypeData = require("../initial-data/crm_Opportunities_Type.json");
const crmOpportunitySaleStagesData = require("../initial-data/crm_Opportunities_Sales_Stages.json");
const crmCampaignsData = require("../initial-data/crm_campaigns.json");
const crmIndustryTypeData = require("../initial-data/crm_Industry_Type.json");
const crmAccountsData = require("../initial-data/crm_Accounts.json");
const journeysData = require("../initial-data/journey.json");

const prisma = new PrismaClient();

const { faker } = require('@faker-js/faker');

const tasksDataGenerator = (quantity: number) => {
    const tasks = [];
    for (let i = 0; i < quantity; i++) {
        tasks.push({
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            startDate: faker.date.past(),
            endDate: faker.date.future(),
            priority: faker.helpers.arrayElement(["LOW", "MEDIUM", "HIGH"]),
            status: faker.helpers.arrayElement(["TODO", "DOING", "DONE", "DELAYED"]),
        });
    }
    return tasks;
}

async function main() {
    // Your seeding logic here using Prisma Client
    console.log("-------- Seeding DB --------");

    //Seed Menu Items
    const modules = await prisma.system_Modules_Enabled.findMany();

    if (modules.length === 0) {
        await prisma.system_Modules_Enabled.createMany({
            data: moduleData,
        });
        console.log("Modules seeded successfully");
    } else {
        console.log("Modules already seeded");
    }

    //Seed CRM Opportunity Types
    const crmOpportunityType = await prisma.crm_Opportunities_Type.findMany();

    if (crmOpportunityType.length === 0) {
        await prisma.crm_Opportunities_Type.createMany({
            data: crmOpportunityTypeData,
        });
        console.log("Opportunity Types seeded successfully");
    } else {
        console.log("Opportunity Types already seeded");
    }

    const crmOpportunitySaleStages =
        await prisma.crm_Opportunities_Sales_Stages.findMany();

    if (crmOpportunitySaleStages.length === 0) {
        await prisma.crm_Opportunities_Sales_Stages.createMany({
            data: crmOpportunitySaleStagesData,
        });
        console.log("Opportunity Sales Stages seeded successfully");
    } else {
        console.log("Opportunity Sales Stages already seeded");
    }

    const crmCampaigns = await prisma.crm_campaigns.findMany();

    if (crmCampaigns.length === 0) {
        await prisma.crm_campaigns.createMany({
            data: crmCampaignsData,
        });
        console.log("Campaigns seeded successfully");
    } else {
        console.log("Campaigns already seeded");
    }

    const crmIndustryType = await prisma.crm_Industry_Type.findMany();

    if (crmIndustryType.length === 0) {
        await prisma.crm_Industry_Type.createMany({
            data: crmIndustryTypeData,
        });
        console.log("Industry Types seeded successfully");
    } else {
        console.log("Industry Types already seeded");
    }

    //Seed GPT Models
    const gptModels = await prisma.gpt_models.findMany();

    if (gptModels.length === 0) {
        await prisma.gpt_models.createMany({
            data: gptModelsData,
        });
        console.log("GPT Models seeded successfully");
    } else {
        console.log("GPT Models already seeded");
    }

    const crmAccountsCount = await prisma.crm_Accounts.count();

    if (crmAccountsCount === 0) {
        console.log("-------- Seeding Accounts --------");

        await prisma.crm_Accounts.createMany({
            data: crmAccountsData,
        });
        console.log("CRM Accounts seeded successfully");
    } else {
        console.log("GPT Accounts already seeded");
    }

    const users = await prisma.users.findMany();
    const accounts = await prisma.crm_Accounts.findMany();

    if (users.length > 0 && accounts.length > 0) {
        for (let i = 0; i < users.length; i++) {
            if (!users[i].accountId) {

                const user = users[i];
                const account = accounts[i % accounts.length];

                await prisma.users.update({
                    where: { id: user.id },
                    data: {
                        account: {
                            connect: {
                                id: account.id,
                            },
                        },
                    }, include: {
                        account: true,
                    }
                });
            }
        }

        console.log("Users updated with Account IDs successfully");
    } else {
        console.log("No users or accounts found to update");
    }

    const tasks = await prisma.tasks.count();

    if (tasks === 0) {

        console.log("-------- Seeding Tasks --------");

        for (let i = 0; i < 9; i++) {
            const newTask = {
                title: faker.lorem.sentence(),
                content: faker.lorem.paragraph(),
                startDate: faker.date.past(),
                endDate: faker.date.future(),
                priority: faker.helpers.arrayElement(["LOW", "MEDIUM", "HIGH"]),
                status: faker.helpers.arrayElement(["TODO", "DOING", "DONE", "DELAYED"]),
            }

            try {
                const randomUser = users[Math.floor(Math.random() * users.length)]
                const account = accounts[Math.floor(Math.random() * accounts.length)]

                await prisma.tasks.create({
                    data: {
                        ...newTask,
                        responsible: {
                            connect: {
                                id: randomUser.id,
                            },
                        },
                        account: {
                            connect: {
                                id: account.id,
                            },
                        }
                    }, include: {
                        responsible: true,
                        account: true
                    }
                })

            } catch (e) {
                console.log("Error creating client: ", e)
            }
        }
        console.log("-------- Seed Tasks Complete --------");
    } else {
        console.log("Tasks already seeded");
    }

    const journeysCount = await prisma.journeys.count();

    if (journeysCount === 0) {
        console.log("-------- Seeding Journeys  --------");

        for (const journey of journeysData) {
            await prisma.journeys.create({
                data: {
                    ...journey
                },
                include: {
                    journeySteps: true
                }
            });
        }
        console.log("Journey seeded successfully");
    } else {
        console.log("Journey already seeded");
    }

    const clientsCount = await prisma.clients.count();

    if (clientsCount === 0) {
        console.log("-------- Seeding Clients --------");

        for (let i = 0; i < 5; i++) {
            let newClient = {
                "name": faker.person.fullName(),
                "description": faker.lorem.paragraph(),
                "recurringContractRevenue": faker.number.float(),
                "image": faker.image.url()
            }

            try {
                const randomUser = users[Math.floor(Math.random() * users.length)]
                const account = accounts[Math.floor(Math.random() * accounts.length)]

                const newTasks = tasksDataGenerator(5)

                await prisma.clients.create({
                    data: {
                        ...newClient,
                        csmResponsible: {
                            connect: {
                                id: randomUser.id,
                            },
                        },
                        tasks: {
                            createMany: {
                                data: newTasks
                            }
                        },
                        account: {
                            connect: {
                                id: account.id,
                            },
                        }
                    }, include: {
                        csmResponsible: true,
                        tasks: true,
                        account: true
                    },
                })
            } catch (e) {
                console.log("Error creating client: ", e)
            }
        }
    } else {
        console.log("Clients already seeded");
    }

    const journeysStepsCount = await prisma.journey_steps_clients.count();

    if (journeysStepsCount === 0) {
        console.log("-------- Seeding Journey Steps Clients --------");

        try {
            const clients = await prisma.clients.findMany();

            const journeySteps = await prisma.journey_steps.findMany({
                where: {
                    position: 0
                },
            })

            if (clients.length > 0) {
                for (let i = 0; i < clients.length; i++) {
                    await prisma.journey_steps_clients.create({
                        data: {
                            journeyStep: {
                                connect: {
                                    id: journeySteps[i % 2].id,
                                },
                            },
                            client: {
                                connect: {
                                    id: clients[i].id,
                                },
                            }
                        }
                    })
                }
            }

            console.log("-------- Seed Journey Steps Clients completed --------");
        } catch (e) {
            console.log("Error creating journey steps clients: ", e)
        }
    } else {
        console.log("Journey Steps Clients already seeded");
    }

    console.log("-------- Seed DB completed --------");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
