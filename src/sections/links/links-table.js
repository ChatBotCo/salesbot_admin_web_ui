import PropTypes from 'prop-types';
import {
  Box, Button,
  Card,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { EyeIcon, EyeSlashIcon, QueueListIcon } from '@heroicons/react/24/solid';
import { useApi } from '../../hooks/use-api';
import { TrashIcon } from '@heroicons/react/24/outline';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';

export const LinksTable = (props) => {
  const {
    items = [],
  } = props;

  const {
    retrainLink,
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
                <TableCell/>
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
                    <TableCell>
                      {
                        link.status && (
                          <Button
                            onClick={()=>retrainLink(link)}
                            startIcon={(
                              <SvgIcon fontSize="small">
                                <ArrowPathIcon />
                              </SvgIcon>
                            )}
                            sx={{ mt: 3 }}
                            variant="contained"
                          >
                            Retrain
                          </Button>
                        )
                      }
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
