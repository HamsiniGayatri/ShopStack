package com.shopstack.shopstack_backend.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.shopstack.shopstack_backend.entity.User;
//import com.shopstack.shopstack_backend.entity.Role;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    //spring creates UserRepo class automatically
    //Spring, create a repository for the User entity where the ID type is Long.

    Optional<User> findByEmail(String email);
    
}