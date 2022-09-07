import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';

function createData ( x, y, a, b ) {
	return {x, y, a, b};
}

function CalculationTable () {
	return (
		<Table bordered hover>
			<thead>
			<tr>
				<th>X<sup>*</sup></th>
				<th>Y<sup>*</sup></th>
				<th>A<sup>*</sup></th>
				<th>B<sup>*</sup></th>
				<th>actions</th>
			</tr>
			</thead>
			<tbody>
			<tr>
				<td>500</td>
				<td>1000</td>
				<td>50</td>
				<td>100</td>
				<td><Button variant="link">Enable</Button> | <Button variant="link">Remove</Button></td>
			</tr>
			<tr>
				<td>500</td>
				<td>1000</td>
				<td>50</td>
				<td>100</td>
				<td><Button variant="link">Enable</Button> | <Button variant="link">Remove</Button></td>
			</tr>
			<tr>
				<td>500</td>
				<td>1000</td>
				<td>50</td>
				<td>100</td>
				<td><Button variant="link">Enable</Button> | <Button variant="link">Remove</Button></td>
			</tr>
			<tr>
				<td>500</td>
				<td>1000</td>
				<td>50</td>
				<td>100</td>
				<td><Button variant="link">Enable</Button> | <Button variant="link">Remove</Button></td>
			</tr>
			</tbody>
		</Table>
	);
}

export default CalculationTable;
