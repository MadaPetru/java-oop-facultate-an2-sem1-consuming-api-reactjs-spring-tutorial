package ro.adi.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class LoadDatabase {

    private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

    @Bean
    CommandLineRunner initDatabase(AnimalRepository repository) {

        return args -> {
            log.info("Preloading " + repository.save(new Animal(1,"Adi",5,false,AgeTime.CHILD,"Pitbul")));
            log.info("Preloading " + repository.save(new Animal(2,"Dan",20,true,AgeTime.ADULT,"Amstaf")));
        };
    }
}