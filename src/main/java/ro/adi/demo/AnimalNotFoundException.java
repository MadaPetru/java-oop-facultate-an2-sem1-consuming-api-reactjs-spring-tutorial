package ro.adi.demo;

public class AnimalNotFoundException extends RuntimeException {

    public AnimalNotFoundException(Long id) {
        super(String.format("Animal not found with id: %s", id));
    }
}
