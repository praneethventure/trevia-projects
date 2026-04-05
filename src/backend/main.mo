import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";


import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

// Use migration functionality for stateful upgrades

actor {
  include MixinStorage();

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Project Management Types
  type ProjectId = Nat;

  type Project = {
    title : Text;
    location : Text;
    imageUrl : Text;
    forSaleUnits : Nat;
    forRentUnits : Nat;
    ongoingPercentage : Nat;
    completedPercentage : Nat;
  };

  module Project {
    public func compare(p1 : Project, p2 : Project) : Order.Order {
      Text.compare(p1.title, p2.title);
    };
  };

  let projects = Map.empty<ProjectId, Project>();
  var nextProjectId = 1;

  // Public query - no authorization needed
  public query func getAllProjects() : async [(ProjectId, Project)] {
    projects.toArray();
  };

  // Public query - no authorization needed
  public query func getProject(id : ProjectId) : async Project {
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) { project };
    };
  };

  // Admin-only operation
  public shared ({ caller }) func addProject(project : Project) : async ProjectId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    let projectId = nextProjectId;
    projects.add(projectId, project);
    nextProjectId += 1;
    projectId;
  };

  // Admin-only operation
  public shared ({ caller }) func editProject(id : ProjectId, project : Project) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    if (not projects.containsKey(id)) {
      Runtime.trap("Project not found");
    };
    projects.add(id, project);
  };

  // Admin-only operation
  public shared ({ caller }) func deleteProject(id : ProjectId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    if (not projects.containsKey(id)) {
      Runtime.trap("Project not found");
    };
    projects.remove(id);
  };

  func seedSampleProjects() {
    let sampleProjects = [
      {
        title = "Luxury Villa Project";
        location = "Guntur City";
        imageUrl = "https://someurl.com/luxuryvilla.jpg";
        forSaleUnits = 120;
        forRentUnits = 30;
        ongoingPercentage = 65;
        completedPercentage = 35;
      },
      {
        title = "Smart Apartments";
        location = "Hyderabad";
        imageUrl = "https://someurl.com/smartapartments.jpg";
        forSaleUnits = 200;
        forRentUnits = 80;
        ongoingPercentage = 40;
        completedPercentage = 60;
      },
      {
        title = "IT Office Park";
        location = "Bangalore";
        imageUrl = "https://someurl.com/itofficepark.jpg";
        forSaleUnits = 50;
        forRentUnits = 120;
        ongoingPercentage = 25;
        completedPercentage = 75;
      },
      {
        title = "Highway Infrastructure";
        location = "Andhra Pradesh";
        imageUrl = "https://someurl.com/highway.jpg";
        forSaleUnits = 0;
        forRentUnits = 0;
        ongoingPercentage = 80;
        completedPercentage = 20;
      },
      {
        title = "Premium Villas";
        location = "Vizag";
        imageUrl = "https://someurl.com/premiumvillas.jpg";
        forSaleUnits = 85;
        forRentUnits = 15;
        ongoingPercentage = 55;
        completedPercentage = 45;
      },
      {
        title = "Commercial Complex";
        location = "Chennai";
        imageUrl = "https://someurl.com/commercialcomplex.jpg";
        forSaleUnits = 60;
        forRentUnits = 90;
        ongoingPercentage = 30;
        completedPercentage = 70;
      },
    ];

    for (project in sampleProjects.values()) {
      let projectId = nextProjectId;
      projects.add(projectId, project);
      nextProjectId += 1;
    };
  };

  // Contact Submission Types & Functions
  type ContactId = Nat;

  public type ContactSubmission = {
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    timestamp : Int;
  };

  let contactSubmissions = Map.empty<ContactId, ContactSubmission>();
  var nextContactId = 1;

  // Public submission - no authorization required (guests can submit)
  public shared func submitContact(name : Text, email : Text, phone : Text, message : Text) : async ContactId {
    let id = nextContactId;
    let submission : ContactSubmission = {
      name;
      email;
      phone;
      message;
      timestamp = Time.now();
    };
    contactSubmissions.add(id, submission);
    nextContactId += 1;
    id;
  };

  // Admin-only operation
  public query ({ caller }) func getAllContactSubmissions() : async [(ContactId, ContactSubmission)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    contactSubmissions.toArray();
  };

  // Admin-only operation
  public shared ({ caller }) func deleteContactSubmission(id : ContactId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    if (not contactSubmissions.containsKey(id)) {
      Runtime.trap("Contact submission not found");
    };
    contactSubmissions.remove(id);
  };

  // Pre- and post upgrade hooks
  system func preupgrade() {};

  system func postupgrade() {
    if (projects.isEmpty()) {
      seedSampleProjects();
    };
  };
};

