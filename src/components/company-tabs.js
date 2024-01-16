import { useEffect, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import { useApi } from '../hooks/use-api';

export const CompanyTabs = (props) => {
  const {
    selectedCompanyId,
    setSelectedCompanyId,
  } = props

  const {
    companiesByCompanyId,
  } = useApi()

  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    const companies = Object.values(companiesByCompanyId) || []
    const firstCompany = (companies.length>0 && companies[0]) || {}
    const firstCompanyId = firstCompany.company_id
    setSelectedCompanyId(firstCompanyId)

    const _tabs = companies.map((company, i) => {
      return <Tab
        key={company.company_id}
        label={company.name}
        value={company.company_id}
      />
    })
    setTabs(_tabs)
  },[companiesByCompanyId]);

  const handleSelectCompany = (e,company_id) => {
    setSelectedCompanyId(company_id);
  }

  return (
    <Tabs
      onChange={handleSelectCompany}
      sx={{ mb: 3 }}
      value={selectedCompanyId}
    >
      {tabs}
    </Tabs>
  );
};

CompanyTabs.propTypes = {
  selectedCompanyId: PropTypes.string,
  setSelectedCompanyId: PropTypes.func,
};
