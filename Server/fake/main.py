from urllib.parse import urlparse
import sqlite3
import psycopg
from faker import Faker
import random
import argparse

# Retrieves db connection from dsn
def get_db_conn(dsn: str):
    parsed = urlparse(dsn)
    if parsed.scheme == "sqlite":
        return sqlite3.connect(
            parsed.path if parsed.path != "/:memory:" else ":memory:"
        )
    if parsed.scheme in {"postgres", "postgresql"}:
        return psycopg.connect(dsn)

    raise ValueError(f"Unsupported DB scheme: {parsed.scheme}")

def populate_with_fake_data(conn, num_people=50, num_groups=5, num_events=15, num_reaches=20):
    """
    Populate the database with fake data for testing.
    Only Tags will have real data: Dev-Software, Dev-Art, Community Building, Attendence
    """
    fake = Faker()
    c = conn.cursor()

    # Insert REAL Tags
    real_tags = ['Dev-Software', 'Dev-Art', 'Community Building', 'Attendence']
    for tag in real_tags:
        c.execute(
            'INSERT INTO tags (name) VALUES (%s) ON CONFLICT (name) DO NOTHING',
            (tag,),
        )
    conn.commit()

    # Get tag IDs
    c.execute('SELECT tid FROM tags')
    tag_ids = [row[0] for row in c.fetchall()]

    # Generate fake People (using discord-like IDs)
    people_dids = []
    for _ in range(num_people):
        did = str(random.randint(100000000000000000, 999999999999999999))  # 18-digit discord ID
        name = fake.name()
        email = fake.email()
        phone = fake.phone_number()
        c.execute(
            'INSERT INTO people (did, name, email, phone) VALUES (%s, %s, %s, %s) '
            'ON CONFLICT (did) DO NOTHING',
            (did, name, email, phone),
        )
        people_dids.append(did)
    conn.commit()

    # Generate fake Groups
    group_ids = []
    group_names = [fake.company() for _ in range(num_groups)]
    for name in group_names:
        c.execute(
            'INSERT INTO groups (name) VALUES (%s) RETURNING gid',
            (name,),
        )
        group_ids.append(c.fetchone()[0])
    conn.commit()

    # Assign volunteers to groups with access levels
    for did in people_dids:
        # Each person joins 0-3 random groups
        num_groups_to_join = random.randint(0, min(3, len(group_ids)))
        selected_groups = random.sample(group_ids, num_groups_to_join)
        for gid in selected_groups:
            access_level = random.choice([0, 1])  # 1 = view, 2 = edit
            c.execute(
                'INSERT INTO volunteer_in_groups (did, gid, access_level) VALUES (%s, %s, %s) '
                'ON CONFLICT DO NOTHING',
                (did, gid, access_level),
            )
    conn.commit()

    # Assign General Roles to people
    for did in people_dids:
        # 0 = Needs approval, 1 = normal organizer, 2 = admin
        access_level = random.choices([0, 1, 2], weights=[10, 80, 10])[0]  # Most are normal organizers
        c.execute(
            'INSERT INTO general_role (did, access_level) VALUES (%s, %s)',
            (did, access_level),
        )
    conn.commit()

    # Generate fake Events
    event_ids = []
    for _ in range(num_events):
        name = fake.catch_phrase()
        description = fake.text(max_nb_chars=200)
        date = fake.date_time_between(start_date='-1y', end_date='+1y').isoformat()
        location = fake.address()
        group = random.choice(group_ids)
        c.execute(
            'INSERT INTO events (name, description, date, location, group_id) '
            'VALUES (%s, %s, %s, %s, %s) RETURNING eid',
            (name, description, date, location, group),
        )
        event_ids.append(c.fetchone()[0])
    conn.commit()

    # Assign Event Participants
    for eid in event_ids:
        # Each event has 5-20 random participants
        num_participants = random.randint(5, min(20, len(people_dids)))
        participants = random.sample(people_dids, num_participants)
        for did in participants:
            c.execute(
                'INSERT INTO event_participants (eid, did) VALUES (%s, %s) '
                'ON CONFLICT DO NOTHING',
                (eid, did),
            )
    conn.commit()

    # Assign Tags to People
    for did in people_dids:
        # Each person gets 1-3 random tags
        num_tags = random.randint(0, min(2, len(tag_ids)))
        selected_tags = random.sample(tag_ids, num_tags)
        for tid in selected_tags:
            c.execute(
                'INSERT INTO assigned_tags (did, tid) VALUES (%s, %s) '
                'ON CONFLICT DO NOTHING',
                (did, tid),
            )
    conn.commit()

    # Generate fake Reaches
    reach_ids = []
    reach_types = ['asset', 'sof_dev', 'ally-reach']
    for _ in range(num_reaches):
        status = random.randint(0, 3)  # 0-3 for different statuses
        assigned = random.choice(people_dids + [None])  # Some may be unassigned
        title = fake.sentence(nb_words=6)
        description = fake.text(max_nb_chars=300)
        reach_type = random.choice(reach_types)
        priority = random.randint(1, 5)  # 1 = highest, 5 = lowest
        c.execute(
            'INSERT INTO reaches (status, assigned, title, description, type, priority) '
            'VALUES (%s, %s, %s, %s, %s, %s) RETURNING rid',
            (status, assigned, title, description, reach_type, priority),
        )
        reach_ids.append(c.fetchone()[0])
    conn.commit()

    # Generate Volunteer Responses to Reaches
    for rid in reach_ids:
        # Each reach gets 0-10 volunteer responses
        num_responses = random.randint(0, min(10, len(people_dids)))
        responders = random.sample(people_dids, num_responses)
        for did in responders:
            response = random.choice([0, 1])  # 1 = accepted, 2 = rejected
            c.execute(
                'INSERT INTO volunteer_responses (rid, did, response) VALUES (%s, %s, %s) '
                'ON CONFLICT DO NOTHING',
                (rid, did, response),
            )
    conn.commit()

    print(f"Database populated with {num_people} people, {num_groups} groups, {num_events} events, and {num_reaches} reaches!")
    print(f"Real tags inserted: {', '.join(real_tags)}")

def parse_args():
    parser = argparse.ArgumentParser(
        description="Create the database and optionally populate it with fake data."
    )

    parser.add_argument(
        "dsn",
        help="Database DSN (e.g. sqlite:/app/dgg-crm.db or postgresql://user:pass@host:5432/dbname)",
    )

    parser.add_argument(
        "--num-people",
        type=int,
        default=50,
        help="Number of people to generate (default: 50)",
    )

    parser.add_argument(
        "--num-groups",
        type=int,
        default=5,
        help="Number of groups to generate (default: 5)",
    )

    parser.add_argument(
        "--num-events",
        type=int,
        default=15,
        help="Number of events to generate (default: 15)",
    )

    parser.add_argument(
        "--num-reaches",
        type=int,
        default=20,
        help="Number of reaches to generate (default: 20)",
    )

    return parser.parse_args()


if __name__ == '__main__':
    args = parse_args()

    conn = get_db_conn(args.dsn)

    print("Populating with fake data...")
    populate_with_fake_data(conn, num_people=args.num_people, num_groups=args.num_groups, num_events=args.num_events, num_reaches=args.num_reaches)

    # Must close connection at end of program
    conn.close()
    print("Database ready for testing!")