function viewClaims() {
    location.href = '/users/id';
}

function tokenClaims() {
    location.href = '/auth/acquireToken';
}

function signOut() {
    location.href = '/auth/signout';
}

function signIn() {
    console.log('HI');
    window.location.href = '/auth/signin';
}

function returnHome() {
    location.href = '/';
}

function readEntries() {
    location.href = '/read';
}

function receiveServiceBusMessages() {
    location.href = '/receive';
}