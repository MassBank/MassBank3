FROM mcr.microsoft.com/devcontainers/base:ubuntu26.04

# Prevent interactive prompts during apt installations
ENV DEBIAN_FRONTEND=noninteractive \
    GOPATH=/go \
    GOBIN=/go/bin \
    PATH=/go/bin:/usr/local/go/bin:${PATH} \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# Install base utilities and tools used by the project scripts.
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash-completion \
    ca-certificates \
    curl \
    git \
    build-essential \
    gnupg \
    jq \
    less \
    make \
    maven \
    nano \
    procps \
    python3 \
    rsync \
    sudo \
    tar \
    unzip \
    vim \
    wget \
    yamllint \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install the Go version required by go.mod (including the matching toolchain).
ARG GO_VERSION=1.23.8
RUN curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" \
    | tar -C /usr/local -xz \
    && ln -sf /usr/local/go/bin/go /usr/local/bin/go \
    && ln -sf /usr/local/go/bin/gofmt /usr/local/bin/gofmt \
    && go version

# Install Node.js 23 to match web-frontend/Dockerfile-frontend.
RUN curl -fsSL https://deb.nodesource.com/setup_23.x | bash - \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && node --version \
    && npm --version \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install the Go tools used by the Go extension and normal Go development.
RUN mkdir -p /go/bin /go/pkg \
    && chown -R vscode:vscode /go \
    && su - vscode -c 'GOBIN=/go/bin go install golang.org/x/tools/gopls@v0.18.1' \
    && su - vscode -c 'GOBIN=/go/bin go install github.com/go-delve/delve/cmd/dlv@v1.24.0' \
    && su - vscode -c 'GOBIN=/go/bin go install mvdan.cc/gofumpt@v0.7.0' \
    && su - vscode -c 'GOBIN=/go/bin go install honnef.co/go/tools/cmd/staticcheck@2024.1.1'

# Configure git safe directory and make development tools available to vscode.
RUN git config --system --add safe.directory '*' \
    && echo 'export PATH="/go/bin:$PATH"' > /etc/profile.d/massbank-go.sh

WORKDIR /workspaces/MassBank3
USER vscode
