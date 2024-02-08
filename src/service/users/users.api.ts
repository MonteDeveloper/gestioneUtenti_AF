
import { useMutation, useQuery } from 'react-query';
import { User } from '../../models/user';
import { pb } from '../../pocketbase';
import { store } from '../../state/store';
import { updateTotalPages } from '../../state/pagination/paginationSlice';
import { updateGlobalListUsers } from '../../state/usersList/usersListSlice';

// Funzioni di fetch
const fetchUsers = async (searchValue?: string) => {
  let query = pb.collection('usersData');

  const currentPage = store.getState().pagination.currentPage;
  const itemPerPage = store.getState().pagination.rowsPerPage;

  if (searchValue) {
    const users = await query.getList<User>(currentPage, itemPerPage, {
      filter: `name ~ "${searchValue}" || surname ~ "${searchValue}" || email ~ "${searchValue}"`,
    });
    store.dispatch(updateTotalPages(users.totalPages));
    store.dispatch(updateGlobalListUsers(users.items));
    return users;
  }

  const users = await query.getList<User>(currentPage, itemPerPage);
  store.dispatch(updateTotalPages(users.totalPages));
  store.dispatch(updateGlobalListUsers(users.items));
  return users;
};

const fetchUserById = async (id: string) => {
  const user = await pb.collection('usersData').getOne<User>(id);
  return user;
};

const mutateDeleteUsersById = async (usersId: string[]) => {
  const deletePromises = usersId.map(async (id) => {
    await pb.collection('usersData').delete(id);
  });

  await Promise.all(deletePromises);
};

const mutateCreateUser = async (user: Partial<User>) => {
  const newUser = await pb.collection('usersData').create<User>(user);
  return newUser;
};

const mutateEditUser = async (userId: string, editedUser: Partial<User>) => {
  await pb.collection('usersData').update(userId, editedUser);
}

// useQuery
export function getUsers(currentPage: number, rowsPerPage: number, searchValue?: string) {
  return useQuery(['users', searchValue, currentPage, rowsPerPage], () => fetchUsers(searchValue));
}

export function getUserById(id: string) {
  return useQuery(['user', id], () => fetchUserById(id));
}

export function deleteUsersById() {
  return useMutation((usersId: string[]) => mutateDeleteUsersById(usersId));
}

export function createUser() {
  return useMutation((user: Partial<User>) => mutateCreateUser(user));
}

export function editUser(userId: string) {
  return useMutation((editedUser: Partial<User>) => mutateEditUser(userId, editedUser));
}

