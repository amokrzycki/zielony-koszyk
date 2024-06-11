interface User {
  id: number;
  role: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  createdAt: Date;
}

export default User;
