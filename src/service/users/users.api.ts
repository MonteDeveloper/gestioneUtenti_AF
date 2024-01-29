
import { useMutation, useQuery } from 'react-query';
import { User } from '../../models/user';
import { pb } from '../../pocketbase';

// Funzioni di fetch
const fetchUsers = async (currentPage: number, searchValue?: string) => {
  let query = pb.collection('usersData');
  const itemPerPage: number = 7; 

  if (searchValue) {
    const users = await query.getList<User>(currentPage, itemPerPage, {
      filter: `name ~ "${searchValue}" || surname ~ "${searchValue}" || email ~ "${searchValue}"`,
    });
    return users;
  }

  const users = await query.getList<User>(currentPage, itemPerPage);
  return users;
};

const fetchUserById = async (id: string) => {
  const user = await pb.collection('usersData').getOne<User>(id);
  return user;
};

const mutateDeleteUsersById = async (usersId: string[]) => {
  try {
      const deletePromises = usersId.map(async (id) => {
          await pb.collection('usersData').delete(id);
      });

      await Promise.all(deletePromises);
  } catch (error) {
      console.error('Errore durante l\'eliminazione degli utenti:', error);
  }
};

const mutateCreateUser = async (user: Partial<User>) => {
  const newUser = await pb.collection('usersData').create<User>(user);
  return newUser;
};

// useQuery
export function getUsers(currentPage: number, searchValue?: string) {
  return useQuery(['users', searchValue, currentPage], () => fetchUsers(currentPage, searchValue));
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

