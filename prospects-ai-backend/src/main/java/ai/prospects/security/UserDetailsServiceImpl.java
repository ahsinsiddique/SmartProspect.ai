package ai.prospects.security;

import ai.prospects.entity.User;
import ai.prospects.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String userIdOrEmail) throws UsernameNotFoundException {
        User user;
        try {
            UUID id = UUID.fromString(userIdOrEmail);
            user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userIdOrEmail));
        } catch (IllegalArgumentException e) {
            user = userRepository.findByEmail(userIdOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userIdOrEmail));
        }
        return UserPrincipal.create(user);
    }
}
