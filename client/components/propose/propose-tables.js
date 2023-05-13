import * as React from 'react';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ProposeTables({factoryContract}) {

  const [pastEvents, setPastEvents] = useState([]);
  const [id, setId] = useState(0);

  const getPastEvent = async () => {
    let filter = await factoryContract.filters.NewPreProductRequested();
    let events = await factoryContract.queryFilter(filter);
    events.forEach((event) => {
        setPastEvents(prevArray => [...prevArray, event.args])
        console.log(pastEvents)
    });
}

  return (
  <>
    <Button variant='contained' sx={{margin: 3}} onClick={getPastEvent}>Show Pre Products</Button>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Company Wallet address</StyledTableCell>
            <StyledTableCell align="right">Product Name</StyledTableCell>
            <StyledTableCell align="right">Query Price</StyledTableCell>
            <StyledTableCell align="right">Interest</StyledTableCell>
            <StyledTableCell align="right"></StyledTableCell>
            <StyledTableCell align="right"></StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pastEvents.map((event) => (
            
              <StyledTableRow key={event.company}>
                <StyledTableCell component="th" scope="row">
                  {event.company}
                </StyledTableCell>
                <StyledTableCell align="right">{ethers.utils.parseBytes32String(event.productName)}</StyledTableCell>
                <StyledTableCell align="right">{ethers.utils.formatEther(event.queryPrice)}</StyledTableCell>
                {/* <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                <StyledTableCell align="right">{row.protein}</StyledTableCell>
                <StyledTableCell align="right">{row.protein}</StyledTableCell> */}
              </StyledTableRow>
          ))}
        </TableBody>

      </Table>
    </TableContainer>
  </>
  );
}