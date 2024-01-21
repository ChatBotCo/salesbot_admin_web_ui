import {useEffect, useState} from 'react';
import {MenuItem, Select} from '@mui/material';
import {useApi} from '../hooks/use-api';

export const CompaniesDropDown = () => {

  const {
    companiesByCompanyId,
    selectedCompanyId, setSelectedCompanyId,
  } = useApi()

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const companies = Object.values(companiesByCompanyId) || []
    const sortedCompanies = companies.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 0;
    });
    if(!selectedCompanyId) {
      const firstCompany = (sortedCompanies.length>0 && sortedCompanies[0]) || {}
      const firstCompanyId = firstCompany.company_id
      setSelectedCompanyId(firstCompanyId)
    }

    const _options = sortedCompanies.map(company => {
      return <MenuItem
        key={company.company_id}
        value={company.company_id}
      >
        {company.name}
      </MenuItem>
    })
    setOptions(_options)
  },[companiesByCompanyId]);

  const handleSelectCompany = event => {
    setSelectedCompanyId(event.target.value)
  }

  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={(options.length && companiesByCompanyId[selectedCompanyId] && selectedCompanyId) || ''}
      label="Age"
      onChange={handleSelectCompany}
      style={{color:'white'}}
    >
      {options}
    </Select>
  )
};
