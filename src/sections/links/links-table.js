import PropTypes from 'prop-types';
import {
  Box,
  Card,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useApi } from '../../hooks/use-api';

export const LinksTable = (props) => {
  const {
    items = [],
  } = props;

  const {
    saveLinkChanges,
  } = useApi()

  const sortedItems = items.sort((a, b) => {
    if (a.link > b.link) {
      return 1;
    }
    if (a.link < b.link) {
      return -1;
    }
    return 0;
  });

  const toggleIgnore = link => {
    return () =>{
      const updatedLink = {...link}
      updatedLink.status = link.status === 'ignore' ? '' : 'ignore'
      saveLinkChanges(updatedLink)
    }
  }

  return (
    <Card>
      <Scrollbar sx={{maxHeight:400}}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell/>
                <TableCell>
                  URL
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Result
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedItems.map((link, i) => {
                return (
                  <TableRow
                    key={link.id}
                  >
                    <TableCell>
                      {i+1}
                    </TableCell>
                    <TableCell>
                      {link.link}
                    </TableCell>
                    <TableCell>
                      {link.status}
                    </TableCell>
                    <TableCell>
                      {link.result}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
    </Card>
  );
};

LinksTable.propTypes = {
  items: PropTypes.array,
};
