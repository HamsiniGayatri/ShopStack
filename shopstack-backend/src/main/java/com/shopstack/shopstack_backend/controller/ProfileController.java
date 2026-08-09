package com.shopstack.shopstack_backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shopstack.shopstack_backend.entity.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Autowired;

import com.shopstack.shopstack_backend.entity.User;
import com.shopstack.shopstack_backend.service.UserService;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    //dependency
    //constructor injection is performed to overcome dependency
    //first @Service automatically produce object for that class userservice
    private final UserService userService;

    public ProfileController(UserService userService)
    {
        this.userService = userService;
    }


    @GetMapping("/{id}")
    public User getProfile(@PathVariable Long id) {
        return userService.getProfile(id);
    }

     @PutMapping("/{id}")
    public User updateProfile(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        return userService.updateProfile(id, updatedUser);
    }

}