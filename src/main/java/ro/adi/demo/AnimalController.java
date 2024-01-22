package ro.adi.demo;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
public class AnimalController {

    private final AnimalRepository repository;

    private final AnimalPaginatedRepository animalPaginatedRepository;
    private final AnimalModelAssembler assembler;

    AnimalController(AnimalRepository repository, AnimalPaginatedRepository animalPaginatedRepository, AnimalModelAssembler assembler) {
        this.repository = repository;
        this.animalPaginatedRepository = animalPaginatedRepository;
        this.assembler = assembler;
    }

    @GetMapping("/animals")
    public CollectionModel<EntityModel<Animal>> all() {

        List<EntityModel<Animal>> employees = repository.findAll().stream()
                .map(assembler::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(employees, linkTo(methodOn(AnimalController.class).all()).withSelfRel());
    }

    @PostMapping("/animals")
    Animal newAnimal(@RequestBody Animal newAnimal) {
        return repository.save(newAnimal);
    }

    @GetMapping("/animals/{id}")
    public EntityModel<Animal> one(@PathVariable Long id) {

        Animal animal = repository.findById(id)
                .orElseThrow(() -> new AnimalNotFoundException(id));
        return assembler.toModel(animal);
    }

    @PutMapping("/animals/{id}")
    Animal replaceAnimal(@RequestBody Animal newAnimal, @PathVariable Long id) {

        return repository.findById(id)
                .map(animal -> {
                    animal.setName(newAnimal.getName());
                    animal.setAge(newAnimal.getAge());
                    animal.setBreed(newAnimal.getBreed());
                    return repository.save(animal);
                })
                .orElseGet(() -> {
                    newAnimal.setId(id);
                    return repository.save(newAnimal);
                });
    }

    @DeleteMapping("/animals/{id}")
    void deleteAnimal(@PathVariable Long id) {
        repository.deleteById(id);
    }
}