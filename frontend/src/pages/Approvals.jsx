import { useEffect, useState } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Paper,
    Typography,
} from "@mui/material";

import {
    getPendingApprovals,
    reviewApproval,
} from "../services/approvalService";

export default function Approvals() {

    const [approvals, setApprovals] = useState([]);

    const loadApprovals = async () => {
        const data = await getPendingApprovals();

        setApprovals(data);
    };

    useEffect(() => {
        loadApprovals();
    }, []);

    const approve = async (id) => {
        await reviewApproval(id, true, "Approved");
        loadApprovals();
    };

    return (
        <Paper sx={{ p: 3 }}>

            <Typography variant="h5">
                Pending Approvals
            </Typography>

            <Table>

                <TableHead>

                    <TableRow>
                        <TableCell>Container</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell></TableCell>
                    </TableRow>

                </TableHead>

                <TableBody>

                    {approvals.map((approval) => (

                        <TableRow key={approval.id}>

                            <TableCell>{approval.container_code}</TableCell>

                            <TableCell>{approval.requested_action}</TableCell>

                            <TableCell>{approval.required_role}</TableCell>

                            <TableCell>{approval.status}</TableCell>

                            <TableCell>

                                <Button
                                    variant="contained"
                                    onClick={() => approve(approval.id)}
                                >
                                    Approve
                                </Button>

                            </TableCell>

                        </TableRow>

                    ))}

                </TableBody>

            </Table>

        </Paper>
    );
}