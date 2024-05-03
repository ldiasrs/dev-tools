import { parse } from "node-xlsx";

const formatBD = (bd) => {
  return `${bd.slice(0, 2)}-${bd.slice(2, 4)}-${bd.slice(4, 8)}`;
};

const formatPhone = (phone) => {
  return phone.length < 11 ? phone + "1" : phone;
};

export const debug = (str) => {
  console.log(`>>>>>> ${str}`);
};

export const getCustomer = (customerXLSIndex) => {
  debug("Getiing customer");
  const file = parse("./afcu-tests.xlsx"); // parses a file
  const customerIndex = customerXLSIndex;
  const customerInfo = file[0].data[customerIndex];
  const customer = {
    firstName: customerInfo[2],
    lastName: customerInfo[3],
    birthDate: formatBD(customerInfo[4]),
    address: customerInfo[5],
    city: customerInfo[6],
    state: customerInfo[7],
    zipCode: customerInfo[8],
    ssNumber: "" + customerInfo[9],
    phone: formatPhone(customerInfo[10]),
    memberId: "" + customerInfo[11],
    email: customerInfo[12],
    annualIncome: customerInfo[13].toString(),
    jobTitle: customerInfo[14],
    employerName: customerInfo[15],
    monthsAtEmployer: "" + customerInfo[16],
    housingPayment: "1200",
  };

  console.log({ customer });
  return customer;
};
