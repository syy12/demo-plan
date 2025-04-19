const express = require("express");
const app = express();
const PORT = 3001;

// Define enum-like object for Plan Types
const PlanType = Object.freeze({
    PREPAID: "Prepaid",
    POSTPAID: "Postpaid"
});

// Mock plan data
const plans = [
    { id: 1, name: "Starter Pack", type: PlanType.PREPAID, dataLimit: 5, validity: 30, price: 10, description: "A basic starter plan with 5GB of data." },
    { id: 2, name: "Unlimited Postpaid", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 50, description: "Unlimited data for postpaid users." },
    { id: 3, name: "Family Plan", type: PlanType.PREPAID, dataLimit: 50, validity: 60, price: 80, description: "A family-sized plan with 50GB of shared data." },
    { id: 4, name: "Super Saver", type: PlanType.PREPAID, dataLimit: 20, validity: 45, price: 25, description: "A budget-friendly plan for moderate users." },
    { id: 5, name: "Business Premium", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 120, description: "Unlimited data designed for businesses." },
    { id: 6, name: "Weekend Binge", type: PlanType.PREPAID, dataLimit: 15, validity: 15, price: 12, description: "A short-term plan perfect for weekend use." },
    { id: 7, name: "Traveler's Delight", type: PlanType.PREPAID, dataLimit: 25, validity: 20, price: 20, description: "A plan tailored for travelers with high data needs." },
    { id: 8, name: "Ultimate Postpaid", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 70, description: "An all-inclusive postpaid plan." },
    { id: 9, name: "Student Flexi", type: PlanType.PREPAID, dataLimit: 10, validity: 30, price: 8, description: "An affordable and flexible plan for students." },
    { id: 10, name: "Corporate Bundle", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 200, description: "Tailored for corporate clients needing reliable, unlimited data." },
    { id: 11, name: "Data Boost", type: PlanType.PREPAID, dataLimit: 30, validity: 30, price: 35, description: "Boost your data limit for a month." },
    { id: 12, name: "Essential Plan", type: PlanType.POSTPAID, dataLimit: 100, validity: 30, price: 60, description: "A postpaid plan for essential users." },
    { id: 13, name: "Weekend Explorer", type: PlanType.PREPAID, dataLimit: 10, validity: 7, price: 5, description: "A budget plan for weekend explorers." },
    { id: 14, name: "Pro Business", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 150, description: "Professional-grade unlimited plan for businesses." },
    { id: 15, name: "Holiday Special", type: PlanType.PREPAID, dataLimit: 40, validity: 14, price: 30, description: "Special data pack for the holiday season." },
    { id: 16, name: "Economy Pack", type: PlanType.PREPAID, dataLimit: 5, validity: 15, price: 7, description: "Affordable plan for light users." },
    { id: 17, name: "Remote Worker Bundle", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 85, description: "Unlimited plan perfect for remote workers." },
    { id: 18, name: "Mega Saver", type: PlanType.PREPAID, dataLimit: 60, validity: 60, price: 90, description: "Long-term saving plan with extra data." },
    { id: 19, name: "Office Pro", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 110, description: "Reliable postpaid plan for office environments." },
    { id: 20, name: "Student Max", type: PlanType.PREPAID, dataLimit: 20, validity: 30, price: 15, description: "Maximize your student life with extra data." },
    { id: 21, name: "Festival Pack", type: PlanType.PREPAID, dataLimit: 25, validity: 10, price: 18, description: "Short but high-volume plan for festive seasons." },
    { id: 22, name: "Global Traveler", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 140, description: "Unlimited data across multiple countries." },
    { id: 23, name: "Family Flex", type: PlanType.PREPAID, dataLimit: 70, validity: 90, price: 100, description: "Flexible data plan for the whole family." },
    { id: 24, name: "Work From Home Pro", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 95, description: "Specifically designed for work-from-home users." },
    { id: 25, name: "Data Lite", type: PlanType.PREPAID, dataLimit: 3, validity: 15, price: 5, description: "A very light and affordable data plan." },
    { id: 26, name: "Executive Plan", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 180, description: "Executive-level plan with premium service." },
    { id: 27, name: "Weekend Warrior", type: PlanType.PREPAID, dataLimit: 12, validity: 7, price: 9, description: "Weekend plan for heavy internet users." },
    { id: 28, name: "Professional Unlimited", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 155, description: "Unlimited postpaid plan for professionals." },
    { id: 29, name: "Data Bonanza", type: PlanType.PREPAID, dataLimit: 80, validity: 60, price: 110, description: "A bonanza of data at a great price." },
    { id: 30, name: "Corporate Ultimate", type: PlanType.POSTPAID, dataLimit: "Unlimited", validity: 30, price: 220, description: "The ultimate plan for big business needs." }
];

app.get("/api/plans", (req, res) => {
    const { type, skip = 0, take = 10, sort } = req.query;

    // If a type is provided, filter plans by that type
    let filteredPlans = plans;

    if (type) {
        filteredPlans = plans.filter(plan => plan.type.toLowerCase() === type.toLowerCase());
    }

    // Sort by price
    if (sort === "asc") {
        filteredPlans.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
        filteredPlans.sort((a, b) => b.price - a.price);
    }

    const totalCount = filteredPlans.length;
    const skipInt = parseInt(skip);
    const takeInt = parseInt(take);
    const paginatedPlans = filteredPlans.slice(skipInt, skipInt + takeInt);

    // Map the plans to a simpler DTO with only the required fields (id, name, type, price)
    const planDTOs = paginatedPlans.map(plan => ({
        id: plan.id,
        name: plan.name,
        type: plan.type,
        price: plan.price
    }));

    const paginatedPlanDtos = ({
        totalCount: totalCount,
        skip: skipInt,
        take: takeInt,
        data: planDTOs
    });

    res.json(paginatedPlanDtos); // Send the DTO array as the response
});

app.get("/api/plans/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const plan = plans.find(p => p.id === id);
    if (plan) {
        res.json(plan);
    }
    else {
        res.status(404).json({ message: "Plan not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
