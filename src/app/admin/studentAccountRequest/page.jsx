import React from 'react';
import StudentTable from './_Component/StudentTable';

export const metadata = {
  title: 'Student Account Request',
  description: 'Manage student account requests',
  keywords: 'student, account, request, management, admin',
};

const page = () => {
  return (
    <div>
      <StudentTable />
    </div>
  );
};

export default page;
