import {useRootAdmin} from "../../hooks/use-root-admin";
import {useAuth} from "../../hooks/use-auth";
import {Box, Button, Card, Stack, SvgIcon, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {useApi} from "../../hooks/use-api";
import {CheckCircleIcon as CheckCircleIconSolid, QuestionMarkCircleIcon, XMarkIcon} from "@heroicons/react/24/solid";

export const UsersTable = () => {
  const {
    user,
  } = useAuth()
  const {
    allUsers,
    updateUserApproval,
  } = useRootAdmin()
  const {
    companiesByCompanyId,
  } = useApi()

  if(!user || user.role!=='root') return <h1>Unauthorized</h1>

  const sortedItems = allUsers.sort((a, b) => {
    if (a.user_name > b.user_name) {
      return 1;
    }
    if (a.user_name < b.user_name) {
      return -1;
    }
    return 0;
  });

  return (
    <Card>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell>
                Email
              </TableCell>
              <TableCell>
                Company ID
              </TableCell>
              <TableCell>
                Status
              </TableCell>
              <TableCell>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedItems.map((user, i) => {
              let company = companiesByCompanyId[user.company_id] || {name:'[not set]'}
              if(user.company_id==='all') company = {name:'Root Admin'}

              let approvalEl = <></>
              switch (user.approval_status) {
                case 'approved':
                  approvalEl = (
                    <SvgIcon fontSize="small" color={'success'}>
                      <CheckCircleIconSolid />
                    </SvgIcon>
                  )
                  break;
                case 'rejected':
                  approvalEl = (
                    <SvgIcon fontSize="small" color={'error'}>
                      <XMarkIcon />
                    </SvgIcon>
                  )
                  break;
                default:
                  approvalEl = (
                    <SvgIcon fontSize="small" color={'warning'}>
                      <QuestionMarkCircleIcon />
                    </SvgIcon>
                  )
                  break;
              }

              return (
                <TableRow
                  key={user.id}
                >
                  <TableCell>
                    {i+1}
                  </TableCell>
                  <TableCell>
                    {user.user_name}
                  </TableCell>
                  <TableCell>
                    {company.name}
                  </TableCell>
                  <TableCell>
                    {approvalEl}
                  </TableCell>
                  <TableCell>
                    <Stack direction={'row'}>
                      {
                        user.approval_status !== 'approved' &&(
                          <Button
                            onClick={()=>updateUserApproval(user, 'approved')}
                            startIcon={(
                              <SvgIcon fontSize="small" color={'success'}>
                                <CheckCircleIconSolid />
                              </SvgIcon>
                            )}
                          >
                            Approve
                          </Button>
                        )
                      }
                      {
                        user.approval_status !== 'rejected' && (
                          <Button
                            onClick={()=>updateUserApproval(user, 'rejected')}
                            startIcon={(
                              <SvgIcon fontSize="small" color={'error'}>
                                <XMarkIcon />
                              </SvgIcon>
                            )}
                          >
                            Deny
                          </Button>
                        )
                      }
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};

