import * as React from 'react';
import { useState } from 'react';
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
import Grid from '@mui/material/Grid';
import * as preProductJson from '../../pages/utils/PreProduct.json';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F2BC07',
    color: theme.palette.common.black,
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
  const [preProductContract, setPreProductContract] = useState();

  // Getting from the logs, the event emitted when a new preProduct is deployed
  const getPastEvent = async () => {
    let filter = await factoryContract.filters.NewPreProductRequested();
    let events = await factoryContract.queryFilter(filter);
    events.forEach((event) => {
        setPastEvents(prevArray => [...prevArray, event.args])
        console.log(pastEvents)
    });
  }

  // Getting the address of the preProduct contract calling the array recording all the contracts deployed on the factory contract 
  // and using the index from the table.
  const getContract = async (index) => {
    try {
      const preProductABI = preProductJson.abi;
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const preProductAddress = await factoryContract.preProducts(index);
      setPreProductContract(new ethers.Contract(
        preProductAddress,
        preProductABI,
        signer
      ));
    } catch (error) {
      console.log(error);
    }
  }

  // Calling the function expressInterest from the preProduct contract.
  const handleConfirmInterest = async (index) => {
    try {
      getContract(index);
      await preProductContract.expressInterest();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div style={{ 'margin-left' : '220px', 'margin-right' : '20px'}}>
    <Grid sx={{textAlign: 'center'}}>
      <Button variant='contained' size='large' sx={{background: '#F2BC07', ":hover": {bgcolor: "#F2BC07"}, color: 'black', margin: 3, marginTop: 8, marginBottom: 8, width: '500px', height: '80px', fontSize: '24px'}} onClick={getPastEvent}>Show Pre Products</Button>
    </Grid>
    <TableContainer component={Paper} >
      <Table sx={{ minWidth: 700, background: '#F2BC07' }} aria-label="customized table">
        <TableHead >
          <TableRow sx={{color: '#F2BC07' }}>
            <StyledTableCell align="left">id</StyledTableCell>
            <StyledTableCell align="right">Company Wallet address</StyledTableCell>
            <StyledTableCell align="right">Product Name</StyledTableCell>
            <StyledTableCell align="right">Query Price</StyledTableCell>
            <StyledTableCell align="right"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pastEvents.map((event, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {index}
              </StyledTableCell>
              <StyledTableCell align="right">{event.company}</StyledTableCell>
              <StyledTableCell align="right">{ethers.utils.parseBytes32String(event.productName)}</StyledTableCell>
              <StyledTableCell align="right">{ethers.utils.formatEther(event.queryPrice)} BNB </StyledTableCell>
              <StyledTableCell align="right">
                <Button onClick={() => handleConfirmInterest(index)}> Confirm interest </Button>
              </StyledTableCell>
            </StyledTableRow>  
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
  );
}