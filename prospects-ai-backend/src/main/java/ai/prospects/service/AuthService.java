package ai.prospects.service;

import ai.prospects.dto.request.LoginRequest;
import ai.prospects.dto.request.RegisterRequest;
import ai.prospects.dto.response.AuthResponse;
import ai.prospects.dto.response.UserResponse;
import ai.prospects.entity.User;
import ai.prospects.exception.BadRequestException;
import ai.prospects.repository.UserRepository;
import ai.prospects.security.JwtTokenProvider;
import ai.prospects.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use: " + request.getEmail());
        }

        User user = User.builder()
            .email(request.getEmail().toLowerCase().trim())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .build();

        user = userRepository.save(user);
        String token = tokenProvider.generateToken(user.getId());

        return buildAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId()).orElseThrow();
        String token = tokenProvider.generateToken(user.getId());

        return buildAuthResponse(user, token);
    }

    @Transactional(readOnly = true)
    public UserResponse getMe(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        return UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole().name())
            .isActive(user.getIsActive())
            .createdAt(user.getCreatedAt())
            .build();
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
            .token(token)
            .tokenType("Bearer")
            .userId(user.getId())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole().name())
            .build();
    }
}
