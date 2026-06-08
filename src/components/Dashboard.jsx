import React, { useState } from "react";
import {
  Box, VStack, HStack, Button, Text, Heading, Flex,
  Input, IconButton, SimpleGrid, Table,              
  Thead, Tbody, Tr, Th, Td, FormControl, FormLabel
} from "@chakra-ui/react";   
import {
  FiHome, FiCreditCard, FiUsers, FiBarChart2,        //Fi stands for feature icon used to display icon 
  FiLogOut, FiSearch
} from "react-icons/fi";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,   //Recharts is a charting library
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, Select, useDisclosure
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { addUser, deleteUser, updateUser } from "../redux/slices/userSlice"; //Redux
import { addAtmApplication, updateAtmApplication } from "../redux/slices/atmSlice";
import { addLoanApplication, updateLoanApplication } from "../redux/slices/loanSlice";

const userData = {
  accountNo: "AC123456789",
  balance: 45200,
  transactions: [
    { id: 1, type: "Deposit", amount: 5000, date: "25 Sept 2025" },
    { id: 2, type: "Withdrawal", amount: -2000, date: "20 Sept 2025" },       //sample data is used to show only hence it is a mini project 
    { id: 3, type: "Bill Payment", amount: -1200, date: "15 Sept 2025" },
    { id: 4, type: "Loan Due", amount: -4000, date: "24 Sept 2025" },
  ],
};

const weeklyActivity = [
  { day: "Mon", deposit: 300, withdraw: 200 },
  { day: "Tue", deposit: 400, withdraw: 100 },
  { day: "Wed", deposit: 500, withdraw: 250 },
  { day: "Thu", deposit: 200, withdraw: 300 },
  { day: "Fri", deposit: 600, withdraw: 200 },       //Dummy data is used to display in Bar chart
  { day: "Sat", deposit: 350, withdraw: 150 },
  { day: "Sun", deposit: 450, withdraw: 100 },
];

const expenseData = [
  { name: "Investment", value: 25 },
  { name: "Bill Expense", value: 25 },
  { name: "Others", value: 20 },                 //Dummy Data is used to display in pie chart 
  { name: "Savings", value: 30 },
];

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28"];  //colors used for pie chart

const atmSchema = yup.object().shape({     //Validation
  name: yup.string().required("Full name is required"),
  accountNo: yup 
    .string()
    .required("Account number is required")
    .min(10, "Account number must be at least 10 digits"),  
});

const loanSchema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  amount: yup
    .number()
    .typeError("Loan amount must be a number")
    .positive("Loan amount must be greater than 0")
    .required("Loan amount is required"),
  purpose: yup.string().required("Purpose is required"),
});
const Dashboard = () => {
  const dispatch = useDispatch();
  const { username, userType } = useSelector((state) => state.auth);
  const usersData = useSelector((state) => state.users.list);
  const atmApplications = useSelector((state) => state.atm.list);
  const loanApplications = useSelector((state) => state.loan.list);  //Redux list
  const [activeTab, setActiveTab] = useState("Dashboard");  
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [rejectMessage, setRejectMessage] = useState("");
  const [newUser, setNewUser] = useState({ username: "", userType: "user" });
  const [editUser, setEditUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();   
  const [atmReasonDrafts, setAtmReasonDrafts] = useState({});
  const [loanReasonDrafts, setLoanReasonDrafts] = useState({});

const handleAddUser = () => {
  if (!newUser.username.trim()) {        //localStorage keeps growing with every new record It doesn’t replace the old ones unless user explicitly clear or overwrite it.
    alert("Username cannot be empty!");    
    return;
  }
  const normalizedUsername = newUser.username.replace(/\s+/g, "").toLowerCase();
  const userExists = usersData.some(
    (u) => u.username.toLowerCase() === newUser.username.toLowerCase()
  );

  if (userExists) {
    alert("User with this username already exists!");
    return;
  }

  const newUserEntry = {
    id: uuidv4(),
    username: newUser.username,
    userType: newUser.userType,
  };

  dispatch(addUser(newUserEntry));
  setNewUser({ username: "", userType: "user" });
  alert("User added successfully!");
};

const handleDeleteUser = (id) => {
  if (window.confirm("Are you sure you want to delete this user?")) {
    dispatch(deleteUser(id));
  }
};

const handleEditUser = (user) => {
  setEditUser(user);
  onOpen();
};

const handleSaveEdit = () => {
   if (!editUser?.username?.trim()) {
      alert("Username cannot be empty!");
      return;
    }
  dispatch(updateUser({id: editUser.id, username: editUser.username, userType: editUser.userType }));
  onClose();
};

  const {
    register: registerAtm,
    handleSubmit: handleSubmitAtm,
    formState: { errors: atmErrors },
    reset: resetAtm,
  } = useForm({ resolver: yupResolver(atmSchema) });

  const {
    register: registerLoan,
    handleSubmit: handleSubmitLoan,
    formState: { errors: loanErrors },
    reset: resetLoan,
  } = useForm({ resolver: yupResolver(loanSchema) });

  const sidebarItems =
    userType === "user"            // This defines sidebar items based on userType whether it is a user or admin
      ? [
          { label: "Dashboard", icon: FiHome },
          { label: "Transactions", icon: FiBarChart2 },
          { label: "Apply ATM Card", icon: FiCreditCard },                           
          { label: "Apply Loan", icon: FiCreditCard },
          { label: "My Applications", icon: FiUsers },
          { label: "Profile", icon: FiUsers },
        ]
      : [
          { label: "Dashboard", icon: FiHome },
          { label: "ATM Card Applications", icon: FiCreditCard },
          { label: "Loan Applications", icon: FiBarChart2 },
          { label: "User Management", icon: FiUsers },
          { label: "Profile", icon: FiUsers },
        ];

  return (   //return is used to display on the screen whatever it is present within the return() without return() nothing will be displayed on screen 
    <Flex minH="100vh" bg="gray.50">
      {/* Sidebar */}
      <VStack w="260px" bg="white" py={6} px={3} spacing={6} shadow="md" align="stretch">
        <Heading size="md" textAlign="center" color="blue.600">Unity Bank</Heading>
        <VStack spacing={2} align="stretch">
          {sidebarItems.map((item) => (
            <Button
              key={item.label}
              justifyContent="flex-start"
              leftIcon={<item.icon />}
              variant={activeTab === item.label ? "solid" : "ghost"}
              colorScheme={activeTab === item.label ? "blue" : "gray"}
              onClick={() => setActiveTab(item.label)}
            >
              {item.label}
            </Button>
          ))}
        </VStack>
        <Button
         mt="auto"
         leftIcon={<FiLogOut />}
         colorScheme="red"
         onClick={() => dispatch(logout())}
        >
        Logout
      </Button>
      </VStack>

      {/* Main Content */}
      <Flex direction="column" flex="1" p={6}>
        {/* Topbar */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="md">Welcome,{username} </Heading>
          <HStack spacing={3}>
            <Input placeholder="Search for something" size="sm" bg="white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <IconButton aria-label="search" icon={<FiSearch />} size="sm" colorScheme="blue" onClick={() => alert(`Searching for: ${searchQuery}`)} />
          </HStack>
        </Flex>

        {/* Dashboard Overview */}
        {activeTab === "Dashboard" && (
          <>
            <SimpleGrid columns={[1, 2, 3]} spacing={6} mb={6}>
              <Box p={6} bg="blue.500" color="white" borderRadius="xl" shadow="lg">
                <Text>Balance</Text>
                <Heading size="lg">₹{userData.balance}</Heading>
                <Text mt={2}>CARD HOLDER: {username}</Text>
                <Text>VALID THRU: 12/26</Text>
              </Box>
              <Box p={6} bg="purple.500" color="white" borderRadius="xl" shadow="lg">
                <Text>Balance</Text>
                <Heading size="lg">₹32,000</Heading>
                <Text mt={2}>CARD HOLDER: John Doe</Text>
                <Text>VALID THRU: 11/25</Text>
              </Box>
              <Box p={6} bg="orange.500" color="white" borderRadius="xl" shadow="lg">
                <Text>Loan Status</Text>
                <Heading size="lg">Pending</Heading>
                <Text mt={2}>₹50,000 Loan Request</Text>
              </Box>
            </SimpleGrid>

            <Flex gap={6}>
              {/* Recent Transactions (Preview) */}
              <Box flex="1" bg="white" p={4} shadow="md" borderRadius="lg">
                <Heading size="sm" mb={4}>Recent Transactions</Heading>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Type</Th>
                      <Th>Date</Th>
                      <Th isNumeric>Amount</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {userData.transactions .filter((tx) =>
                        tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tx.date.toLowerCase().includes(searchQuery.toLowerCase())
                      ).slice(0, 3).map((tx) => (
                      <Tr key={tx.id}>
                        <Td>{tx.id}</Td>
                        <Td>{tx.type}</Td>
                        <Td>{tx.date}</Td>
                        <Td isNumeric>
                          <Text color={tx.amount < 0 ? "red.500" : "green.500"} fontWeight="bold">   {/* red.500 indicates debit and green.500 indicates credit */}
                            {tx.amount < 0 ? `-₹${Math.abs(tx.amount)}` : `+₹${tx.amount}`}      
                          </Text>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              {/* Charts */}
              <VStack w="400px" spacing={6}>
                <Box w="100%" h="200px" bg="white" p={5} shadow="md" borderRadius="lg">
                  <Heading size="sm" mb={4}>Weekly Activity</Heading>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="deposit" fill="#3182ce" />
                      <Bar dataKey="withdraw" fill="#38b2ac" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Box w="100%" h="200px" bg="white" p={4} shadow="md" borderRadius="lg">
                  <Heading size="sm" mb={4}>Expense Statistics</Heading>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expenseData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label>
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </Flex>
          </>
        )}

        {/* Transactions Page */}
        {activeTab === "Transactions" && (
          <Box bg="white" p={6} shadow="md" borderRadius="lg">
            <Heading size="md" mb={4}>All Transactions</Heading>
            <Table variant="striped" size="sm"> 
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Type</Th>
                  <Th>Date</Th>
                  <Th isNumeric>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userData.transactions .filter((tx) =>
                    tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    tx.date.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((tx) => (
                  <Tr key={tx.id}>
                    <Td>{tx.id}</Td>
                    <Td>{tx.type}</Td>
                    <Td>{tx.date}</Td>
                    <Td isNumeric>
                      <Text color={tx.amount < 0 ? "red.500" : "green.500"} fontWeight="bold">
                        {tx.amount < 0 ? `-₹${Math.abs(tx.amount)}` : `+₹${tx.amount}`}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {/* Apply ATM Card */}
        {activeTab === "Apply ATM Card" && userType === "user" && (
  <Box bg="white" p={6} shadow="md" borderRadius="lg">
    <Heading size="md" mb={6}>Apply for ATM Card</Heading>
    {successMessage && <Text color="green.600" fontWeight="bold" mb={3}>{successMessage}</Text>}
    {rejectMessage && <Text color="red.600" fontWeight="bold" mb={3}>{rejectMessage}</Text>}

    <form
      onSubmit={handleSubmitAtm((data) => {
        dispatch(addAtmApplication({ ...data,
        name: username,      
        status: "Pending",
        reason: "" }));
        resetAtm();
        setSuccessMessage("ATM Card Application submitted successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      })}
    >
      <FormControl mb={3} isInvalid={!!atmErrors.name}>
        <FormLabel>Name</FormLabel>
        <Input {...registerAtm("name")} />    {/*Name input field with validation and error handling*/}
        {atmErrors.name && <Text color="red.500" fontSize="sm">{atmErrors.name.message}</Text>} 
      </FormControl>

      <FormControl mb={3} isInvalid={!!atmErrors.accountNo}>
        <FormLabel>Account Number</FormLabel>
        <Input {...registerAtm("accountNo")} />
        {atmErrors.accountNo && <Text color="red.500" fontSize="sm">{atmErrors.accountNo.message}</Text>}
      </FormControl>

      <Button type="submit" colorScheme="green">Submit ATM Card Request</Button>
    </form>
  </Box>
)}

        {/* Apply Loan */}
        {activeTab === "Apply Loan" && userType === "user" && (
    <Box bg="white" p={6} shadow="md" borderRadius="lg">
    <Heading size="md" mb={6}>Apply for Loan</Heading> 
    {successMessage && <Text color="green.600" fontWeight="bold" mb={3}>{successMessage}</Text>}
    {rejectMessage && <Text color="red.600" fontWeight="bold" mb={3}>{rejectMessage}</Text>} 

    <form
      onSubmit={handleSubmitLoan((data) => {
        dispatch(addLoanApplication({...data,
            name: username,      
            status: "Pending",
            reason: ""}));
        resetLoan();
        setSuccessMessage("Loan Application submitted successfully");  
        setTimeout(() => setSuccessMessage(""), 3000);
      })}    
    >
      <FormControl mb={3} isInvalid={!!loanErrors.name}> 
        <FormLabel>Full Name</FormLabel>
        <Input {...registerLoan("name")} />
        {loanErrors.name && <Text color="red.500" fontSize="sm">{loanErrors.name.message}</Text>} 
      </FormControl>

      <FormControl mb={3} isInvalid={!!loanErrors.amount}>
        <FormLabel>Loan Amount</FormLabel> 
        <Input type="number" {...registerLoan("amount")} />
        {loanErrors.amount && <Text color="red.500" fontSize="sm">{loanErrors.amount.message}</Text>} 
      </FormControl> 

      <FormControl mb={3} isInvalid={!!loanErrors.purpose}>
        <FormLabel>Purpose</FormLabel>
        <Input {...registerLoan("purpose")} />
        {loanErrors.purpose && <Text color="red.500" fontSize="sm">{loanErrors.purpose.message}</Text>}
      </FormControl>

      <Button type="submit" colorScheme="purple">Submit Loan Request</Button>
    </form>
  </Box>
)}

        {/* Admin: ATM Applications */}
        {activeTab === "ATM Card Applications" && userType === "admin" && (
          <Box bg="white" p={6} shadow="md" borderRadius="lg">
            <Heading size="md" mb={4}>Manage ATM Card Applications</Heading>
            {successMessage && (
            <Text color="green.600" fontWeight="bold" mb={3}>  
            {successMessage}
            </Text>
           )}
          {rejectMessage && (
         <Text color="red.600" fontWeight="bold" mb={3}>
         {rejectMessage}
         </Text>
          )}
            {atmApplications.length === 0 ? (
              <Text>No ATM applications yet.</Text>
            ) : (
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>ID</Th><Th>Name</Th><Th>Account No</Th><Th>Status</Th><Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {atmApplications.map((app, index) => (
                    <Tr key={index}>
                      <Td>{index + 1}</Td>
                      <Td>{app.name}</Td>
                      <Td>{app.accountNo}</Td>
                      <Td>{app.status}</Td>
                      <Td>
                <Input
                  placeholder="Reason"
                  size="sm"
                  value={atmReasonDrafts[app.id] ?? app.reason ?? ""}
                  onChange={(e) => {
                    setAtmReasonDrafts({...atmReasonDrafts,[app.id]: e.target.value});
                  }}
                  isDisabled={app.status === "Approved" || app.status === "Rejected"}  //Disable input if already approved/rejected here strict equality operator is used to check whether it has same value in both sides such as if user click approve or reject button reason field gets disabled
                 />
                </Td>
                      <Td>
                        <Button size="sm" colorScheme="green" mr={2} isDisabled={app.status !== "Pending"}
                          onClick={() => {
                          dispatch(updateAtmApplication({ id: app.id, status: "Approved", reason: "" }));
                          setSuccessMessage("ATM Application Approved successfully");
                          setTimeout(() => setSuccessMessage(""), 3000);  //setTimeout is used to display the message for 3 seconds
                          }}>
                          Approve 
                        </Button>
                        <Button size="sm" colorScheme="red" isDisabled={app.status !== "Pending" || !(atmReasonDrafts[app.id] || "").trim()} //Optional chaining is used to disable Reject Button if no reason is typed
                          onClick={() => {
                          dispatch(updateAtmApplication({ id: app.id, status: "Rejected", reason:  (atmReasonDrafts[app.id] || "").trim() }));
                          setSuccessMessage("ATM Application Rejected successfully");
                          setTimeout(() => setSuccessMessage(""), 3000);  
                          }}>
                          Reject
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>
        )}

        {/* Admin: Loan Applications */}
        {activeTab === "Loan Applications" && userType === "admin" && (
  <Box bg="white" p={6} shadow="md" borderRadius="lg">
    <Heading size="md" mb={4}>Manage Loan Applications</Heading>

    {successMessage && (
      <Text color="green.600" fontWeight="bold" mb={3}>
        {successMessage}
      </Text>
    )}
    {rejectMessage && (
      <Text color="red.600" fontWeight="bold" mb={3}>
        {rejectMessage}
      </Text>
    )}

    {loanApplications.length === 0 ? (
      <Text>No Loan applications yet.</Text>
    ) : (
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Amount</Th>
            <Th>Purpose</Th>
            <Th>Status</Th>
            <Th>Reason</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loanApplications.map((app, index) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{app.name}</Td>
              <Td>₹{app.amount}</Td>
              <Td>{app.purpose}</Td>
              <Td>{app.status}</Td>
              <Td>
                <Input
                  placeholder="Reason"
                  size="sm"
                  value={loanReasonDrafts[app.id] ?? app.reason ?? ""}
                  onChange={(e) => {
                    setLoanReasonDrafts((prev) => ({...prev, [app.id]: e.target.value }));
                  }}
                  isDisabled={app.status === "Approved" || app.status === "Rejected"}
                />
              </Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="green"
                  mr={2}
                  isDisabled={app.status !== "Pending"}
                  onClick={() => {
                    dispatch(updateLoanApplication({ id: app.id, status: "Approved", reason: "" }));
                    setLoanReasonDrafts(prev => ({ ...prev, [app.id]: "" }));
                    setSuccessMessage("Loan Application Approved successfully");
                    setTimeout(() => setSuccessMessage(""), 3000);
                  }}
                >
                  Approve
                </Button>

                <Button
                  size="sm"
                  colorScheme="red"
                  isDisabled={app.status !== "Pending" || !loanReasonDrafts[app.id]?.trim()}
                  onClick={() => {
                    dispatch(updateLoanApplication({ id: app.id, status: "Rejected", reason: (loanReasonDrafts[app.id] || "").trim() }));
                    setLoanReasonDrafts(prev => ({ ...prev, [app.id]: "" })); 
                    setSuccessMessage("Loan Application Rejected successfully");
                    setTimeout(() => setSuccessMessage(""), 3000);
                  }}
                >
                  Reject
                </Button>
              </Td>
            </Tr>
          ))} 
        </Tbody>
      </Table>
    )}
  </Box>
)}
        {/* Admin: User Management */}
        {activeTab === "User Management" && userType === "admin" && (
          <Box bg="white" p={6} shadow="md" borderRadius="lg">
            <Heading size="md" mb={4}>Manage Users</Heading>
            <Flex mb={4} gap={3} align="flex-end">
              <FormControl  w="350px">
                <FormLabel>Search User</FormLabel>
                <Input
                  placeholder="search Username"
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}   //search section to search user
                /> 
              </FormControl>
              <FormControl w="350px"> 
    <FormLabel>Username</FormLabel>
    <Input
      placeholder="Enter username"  //Add user section
      value={newUser.username} 
      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
    /> 
  </FormControl>
              <FormControl w="150px">
                <FormLabel>Role</FormLabel>
                <Select
                  value={newUser.userType}
                  onChange={(e) => setNewUser({ ...newUser, userType: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>

              <Button colorScheme="blue" onClick={handleAddUser}>
                Add
              </Button>
            </Flex>

            {usersData.length === 0 ? (
              <Text>No users registered yet.</Text>
            ) : (
              <Table variant="striped" size="sm">
                <Thead>
                  <Tr>
                    <Th w="300px">Id</Th>
                    <Th>Username</Th>
                    <Th>Role</Th>
                    </Tr>
                </Thead>
                <Tbody>
                  {usersData
                  .filter((u) => 
                    u.userType !== "admin" && //filter is used to show only user and ! operator is used used to prevent admin from displaying in user management
                    u.username.toLowerCase().includes(searchQuery.toLowerCase())    
)
                  .map((u) => (
                    <Tr key={u.id}>
                       <Td whiteSpace="normal" wordBreak="break-all">{u.id}</Td>
                      <Td>{u.username}</Td> {/*CRUD in User Management gives the Admin full control over all user records — to add,view, edit, or delete them when needed*/}
                      <Td>{u.userType}</Td>
                      <Td>
                        <Button 
                          size="sm" 
                          colorScheme="yellow" 
                          mr={2}
                          onClick={() => handleEditUser(u)}
                        >
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            colorScheme="red"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            Delete
                          </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl mb={3}>
                    <FormLabel>Username</FormLabel>
                    <Input
                      value={editUser?.username || ""}
                      onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Select
                      value={editUser?.userType || "user"}
                      onChange={(e) => setEditUser({ ...editUser, userType: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handleSaveEdit}>
                    Save
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box> 
        )}
        {/* My Application*/}
        {activeTab === "My Applications" && userType === "user" && ( 
        <Box bg="white" p={6} shadow="md" borderRadius="lg">
        <Heading size="md" mb={4}>My Applications</Heading>

    {/* ATM Applications */}
    <Heading size="sm" mt={4} mb={2}>ATM Card Applications</Heading>
    {atmApplications.filter(app => app.username === username).length === 0 ? (
      <Text>No ATM card applications submitted.</Text>
    ) : (
      <Table variant="simple" size="sm" mb={6}>
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Account No</Th>
            <Th>Status</Th>
            <Th>Reason</Th>
          </Tr>
        </Thead>
        <Tbody>
          {atmApplications
            .filter(app => app.username === username)
            .map((app) => (
              <Tr key={app.id}>
                <Td>{app.id}</Td>
                <Td>{app.accountNo}</Td>
                <Td
                  color={
                    app.status === "Rejected" ? "red.500" : app.status === "Approved" ? "green.500" : "orange.500"
                  }
                >
                  {app.status}
                </Td>
                <Td>{app.status === "Rejected" ? app.reason : "-"}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    )}

    {/* Loan Applications */}
    <Heading size="sm" mt={4} mb={2}>Loan Applications</Heading>
    {loanApplications.filter(app => app.name === username).length === 0 ? (
      <Text>No Loan applications submitted.</Text>
    ) : (
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Amount</Th>
            <Th>Purpose</Th>
            <Th>Status</Th>
            <Th>Reason</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loanApplications
            .filter(app => app.username === username)
            .map((app) => (
              <Tr key={app.id}>
                <Td>{app.id}</Td>
                <Td>₹{app.amount}</Td>
                <Td>{app.purpose}</Td>
                <Td
                  color={
                    app.status === "Rejected"
                      ? "red.500"
                      : app.status === "Approved"
                      ? "green.500"
                      : "orange.500"
                  }
                  fontWeight="bold"
                >
                  {app.status}
                </Td>
                <Td>{app.status === "Rejected" ? app.reason : "-"}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    )}
  </Box>
)}
        {/* Profile */}
        {activeTab === "Profile" && (
          <Box bg="white" p={6} shadow="md" borderRadius="lg">
            <Heading size="md" mb={4}>Profile</Heading>
            <Text>Name: {username}</Text>
            <Text>Account No: {userData.accountNo}</Text>
            <Text>Balance: ₹{userData.balance}</Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};
export default Dashboard;
