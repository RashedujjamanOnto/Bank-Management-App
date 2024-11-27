import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import API from "../services/api";

const SavingsPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await API.get("/Savings/GetSavingsPlans");
      setPlans(response.data);
    } catch (error) {
      console.error("Failed to fetch savings plans:", error);
    }
  };

  const enrollPlan = async (planId) => {
    try {
      await API.post("/Savings/EnrollSavingsPlan", { accountId: 1, planId: planId, amount: 1000 });
      alert("Successfully enrolled in the savings plan!");
    } catch (error) {
      console.error("Failed to enroll in plan:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 5, pl:30 }}>
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Savings Plans
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plan Type</TableCell>
              <TableCell>Interest Rate (%)</TableCell>
              <TableCell>Minimum Amount</TableCell>
              <TableCell>Duration (Months)</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.planId}>
                <TableCell>{plan.planType}</TableCell>
                <TableCell>{plan.interestRate}</TableCell>
                <TableCell>{plan.minimumAmount}</TableCell>
                <TableCell>{plan.durationInMonths}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => enrollPlan(plan.planId)}
                  >
                    Enroll
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default SavingsPlans;
