package com.example.crm.customers.infrastructure;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.example.crm.customers.application.dto.CustomerListResponse;
import com.example.crm.customers.application.dto.CustomerOutput;
import com.example.crm.customers.domain.Customer;
import com.example.crm.customers.domain.CustomerRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

@Repository
public class CustomerRepositoryImpl implements CustomerRepository {

    private final CustomerJpaRepository jpaRepository;
    private final EntityManager entityManager;

    public CustomerRepositoryImpl(CustomerJpaRepository jpaRepository, EntityManager entityManager) {
        this.jpaRepository = jpaRepository;
        this.entityManager = entityManager;
    }

    @Override
    public CustomerListResponse searchCustomers(
        String search,
        String type,
        String tier,
        String status,
        int page,
        int pageSize,
        String sortBy,
        String sortOrder
    ) {
        CriteriaBuilder builder = entityManager.getCriteriaBuilder();
        CriteriaQuery<Customer> query = builder.createQuery(Customer.class);
        Root<Customer> root = query.from(Customer.class);

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(builder.isFalse(root.get("deleted")));

        if (search != null && !search.isBlank()) {
            String pattern = "%" + search.toLowerCase() + "%";
            Predicate namePredicate = builder.like(builder.lower(root.get("name")), pattern);
            Predicate emailPredicate = builder.like(builder.lower(root.get("email")), pattern);
            Predicate phonePredicate = builder.like(builder.lower(root.get("phone")), pattern);
            predicates.add(builder.or(namePredicate, emailPredicate, phonePredicate));
        }

        if (type != null && !type.isBlank()) {
            predicates.add(builder.equal(root.get("type"), type));
        }

        if (tier != null && !tier.isBlank()) {
            predicates.add(builder.equal(root.get("tier"), tier));
        }

        if (status != null && !status.isBlank()) {
            predicates.add(builder.equal(root.get("status"), status));
        }

        query.where(predicates.toArray(new Predicate[0]));

        if (sortBy == null || sortBy.isBlank()) {
            sortBy = "createdAt";
        }

        boolean descending = "desc".equalsIgnoreCase(sortOrder);
        if (descending) {
            query.orderBy(builder.desc(root.get(sortBy)));
        } else {
            query.orderBy(builder.asc(root.get(sortBy)));
        }

        TypedQuery<Customer> typedQuery = entityManager.createQuery(query);
        int offset = Math.max(0, page - 1) * pageSize;
        typedQuery.setFirstResult(offset);
        typedQuery.setMaxResults(pageSize);

        List<Customer> customers = typedQuery.getResultList();

        CriteriaQuery<Long> countQuery = builder.createQuery(Long.class);
        Root<Customer> countRoot = countQuery.from(Customer.class);
        countQuery.select(builder.count(countRoot));
        List<Predicate> countPredicates = new ArrayList<>();
        countPredicates.add(builder.isFalse(countRoot.get("deleted")));

        if (search != null && !search.isBlank()) {
            String pattern = "%" + search.toLowerCase() + "%";
            Predicate namePredicate = builder.like(builder.lower(countRoot.get("name")), pattern);
            Predicate emailPredicate = builder.like(builder.lower(countRoot.get("email")), pattern);
            Predicate phonePredicate = builder.like(builder.lower(countRoot.get("phone")), pattern);
            countPredicates.add(builder.or(namePredicate, emailPredicate, phonePredicate));
        }

        if (type != null && !type.isBlank()) {
            countPredicates.add(builder.equal(countRoot.get("type"), type));
        }

        if (tier != null && !tier.isBlank()) {
            countPredicates.add(builder.equal(countRoot.get("tier"), tier));
        }

        if (status != null && !status.isBlank()) {
            countPredicates.add(builder.equal(countRoot.get("status"), status));
        }

        countQuery.where(countPredicates.toArray(new Predicate[0]));
        Long totalCount = entityManager.createQuery(countQuery).getSingleResult();

        CustomerListResponse response = new CustomerListResponse();
        response.setData(customers.stream().map(CustomerOutput::fromEntity).toList());
        response.setTotal(totalCount.intValue());
        response.setPage(page);
        response.setPageSize(pageSize);
        response.setTotalPages((int) Math.ceil((double) totalCount / pageSize));

        return response;
    }

    @Override
    public Optional<Customer> findById(Long id) {
        return jpaRepository.findByIdAndDeletedFalse(id);
    }

    @Override
    public Customer save(Customer customer) {
        return jpaRepository.save(customer);
    }

    @Override
    public void deleteById(Long id) {
        jpaRepository.findById(id).ifPresent(customer -> {
            customer.setDeleted(true);
            jpaRepository.save(customer);
        });
    }
}
