const AdminTable = ({ admins }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="table-auto min-w-full border border-gray-200 bg-white rounded-lg">
        <thead className="bg-blue-50 border-b hidden sm:table-header-group">
          <tr>
            <th className="py-3 px-6 text-left text-blue-700 font-semibold">
              Name
            </th>
            <th className="py-3 px-6 text-left text-blue-700 font-semibold">
              Email
            </th>
          </tr>
        </thead>
        <tbody>
          {admins &&
            admins.map((admin) => (
              <tr
                key={admin._id}
                className="border-b flex flex-col sm:table-row"
              >
                <td className="py-3 px-6 text-gray-800 before:content-['Name:'] before:font-semibold before:block sm:before:hidden">
                  {admin.name}
                </td>
                <td className="py-3 px-6 text-gray-800 before:content-['Email:'] before:font-semibold before:block sm:before:hidden">
                  {admin.email}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
