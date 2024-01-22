package ro.adi.demo;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnimalPaginatedRepository extends PagingAndSortingRepository<Animal,Long> {
}
