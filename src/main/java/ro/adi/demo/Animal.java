package ro.adi.demo;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.Objects;

@Entity
public class Animal {

    @Id
    @GeneratedValue
    private long id;
    private String name;
    private int age;
    private boolean isFemale;
    private AgeTime ageTime;
    private String breed;

    public Animal(){

    }

    public Animal(long id, String name, int age, boolean isFemale, AgeTime ageTime, String breed) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.isFemale = isFemale;
        this.ageTime = ageTime;
        this.breed = breed;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public boolean isFemale() {
        return isFemale;
    }

    public void setFemale(boolean female) {
        isFemale = female;
    }

    public AgeTime getAgeTime() {
        return ageTime;
    }

    public void setAgeTime(AgeTime ageTime) {
        this.ageTime = ageTime;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Animal animal = (Animal) o;
        return id == animal.id && age == animal.age && isFemale == animal.isFemale && Objects.equals(name, animal.name) && ageTime == animal.ageTime && Objects.equals(breed, animal.breed);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, age, isFemale, ageTime, breed);
    }

    @Override
    public String toString() {
        return "Animal{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                ", isFemale=" + isFemale +
                ", ageTime=" + ageTime +
                ", breed='" + breed + '\'' +
                '}';
    }
}